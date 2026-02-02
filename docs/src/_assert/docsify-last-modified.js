var CONFIG = {
    repo: '',
    apiBase: 'https://api.github.com',
    basePath: 'docs/',
    preString: 'Last modified:',
    dateFormat: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}',
    align: 'right',
    apiLimit: 60,
    timeout: 8000,
    failedCacheTtl: 5 * 60 * 1000,
    fallbackToHead: true,
    // true: 优先同源 HEAD(对象存储); false: 优先 GitHub API
    preferHead: true,
};

// 缓存已获取的日期，避免重复请求 GitHub API
var dateCache = {};
// 记录失败的路径，避免重复请求
var failedPaths = {};
// API 请求计数（简单的速率限制保护）
var apiRequestCount = 0;

function normalizePath(path) {
    return path ? path.replace(/^\/+/, '') : '';
}

function joinPath(base, file) {
    if (!base) return file;
    return base.replace(/\/+$/, '') + '/' + file.replace(/^\/+/, '');
}

function formatDate(value) {
    return tinydate(CONFIG.dateFormat)(new Date(value));
}

function isFailedRecently(path) {
    var info = failedPaths[path];
    if (!info) return false;
    if (Date.now() - info.ts < CONFIG.failedCacheTtl) return true;
    delete failedPaths[path];
    return false;
}

function markFailed(path) {
    failedPaths[path] = { ts: Date.now() };
}

function fetchWithTimeout(url, options, timeoutMs) {
    var controller = new AbortController();
    var timeoutId = setTimeout(function() { controller.abort(); }, timeoutMs);
    var opts = options || {};
    opts.signal = controller.signal;
    return fetch(url, opts)
        .then(function(response) {
            clearTimeout(timeoutId);
            return response;
        })
        .catch(function(error) {
            clearTimeout(timeoutId);
            throw error;
        });
}

function getContentUrl(vm, filePath) {
    if (vm.router && typeof vm.router.getFile === 'function') {
        return vm.router.getFile(filePath);
    }
    var base = (vm.config && vm.config.basePath) ? vm.config.basePath : '';
    return joinPath(base, filePath);
}

function fetchLastModifiedFromGitHub(filePath) {
    if (!CONFIG.repo) return Promise.resolve('');
    if (apiRequestCount >= CONFIG.apiLimit) return Promise.resolve('');

    apiRequestCount++;
    var repoPath = joinPath(normalizePath(CONFIG.basePath), normalizePath(filePath));
    var encodedPath = encodeURIComponent(repoPath);
    var dateUrl = CONFIG.apiBase.replace(/\/+$/, '') +
        '/repos/' + CONFIG.repo + '/commits?per_page=1&path=' + encodedPath;

    return fetchWithTimeout(dateUrl, {}, CONFIG.timeout)
        .then(function(response) {
            if (!response.ok) return [];
            return response.json();
        })
        .then(function(commits) {
            if (commits && commits.length > 0 && commits[0].commit) {
                return formatDate(commits[0].commit.committer.date);
            }
            return '';
        })
        .catch(function() {
            return '';
        });
}

function fetchLastModifiedByHead(vm, filePath) {
    var url = getContentUrl(vm, filePath);
    return fetchWithTimeout(url, { method: 'HEAD', cache: 'no-store' }, CONFIG.timeout)
        .then(function(response) {
            if (!response.ok) return '';
            var header = response.headers.get('Last-Modified') || response.headers.get('last-modified');
            if (!header) return '';
            return formatDate(header);
        })
        .catch(function() {
            return '';
        });
}

var install = function (hook, vm) {
    var opts = vm.config.lastModified || CONFIG;
    CONFIG.repo = opts.repo && typeof opts.repo === 'string' ? opts.repo : CONFIG.repo;
    CONFIG.apiBase = opts.apiBase && typeof opts.apiBase === 'string' ? opts.apiBase : CONFIG.apiBase;
    CONFIG.basePath = opts.basePath && typeof opts.basePath === 'string' ? opts.basePath : CONFIG.basePath;
    CONFIG.preString = opts.preString && typeof opts.preString === 'string' ? opts.preString : CONFIG.preString;
    CONFIG.dateFormat = opts.dateFormat && typeof opts.dateFormat === 'string' ? opts.dateFormat : CONFIG.dateFormat;
    CONFIG.align = opts.align && typeof opts.align === 'string' ? opts.align : CONFIG.align;
    CONFIG.apiLimit = typeof opts.apiLimit === 'number' ? opts.apiLimit : CONFIG.apiLimit;
    CONFIG.timeout = typeof opts.timeout === 'number' ? opts.timeout : CONFIG.timeout;
    CONFIG.failedCacheTtl = typeof opts.failedCacheTtl === 'number' ? opts.failedCacheTtl : CONFIG.failedCacheTtl;
    CONFIG.fallbackToHead = typeof opts.fallbackToHead === 'boolean' ? opts.fallbackToHead : CONFIG.fallbackToHead;
    CONFIG.preferHead = typeof opts.preferHead === 'boolean' ? opts.preferHead : CONFIG.preferHead;

    // 使用 beforeEach 添加 HTML 结构
    hook.beforeEach(function(html) {
        return (html + '\n----\n' + '<div align="' + CONFIG.align + '"><span id="last-modified"></span></div>');
    });

    // 使用 doneEach 在 DOM 渲染完成后操作元素
    hook.doneEach(function() {
        var element = document.getElementById('last-modified');
        if (!element) return;

        var filePath = vm.route.file;
        if (!filePath) {
            element.textContent = '';
            return;
        }

        // 检查缓存
        if (dateCache[filePath]) {
            element.textContent = CONFIG.preString + dateCache[filePath];
            return;
        }

        // 短时间内失败过，先跳过，避免频繁请求
        if (isFailedRecently(filePath)) {
            element.textContent = '';
            return;
        }

        function renderTime(time) {
            var el = document.getElementById('last-modified');
            if (!el) return;
            el.textContent = time ? (CONFIG.preString + time) : '';
        }

        function saveAndRender(time) {
            if (time) {
                dateCache[filePath] = time;
                renderTime(time);
                return true;
            }
            return false;
        }

        function handleFailure() {
            markFailed(filePath);
            renderTime('');
        }

        function tryHeadFallback() {
            if (!CONFIG.fallbackToHead) {
                handleFailure();
                return;
            }
            fetchLastModifiedByHead(vm, filePath)
                .then(function(time) {
                    if (!saveAndRender(time)) {
                        handleFailure();
                    }
                });
        }

        function tryGitHubFallback() {
            if (CONFIG.repo === '') {
                handleFailure();
                return;
            }
            fetchLastModifiedFromGitHub(filePath)
                .then(function(time) {
                    if (!saveAndRender(time)) {
                        handleFailure();
                    }
                });
        }

        if (CONFIG.preferHead) {
            fetchLastModifiedByHead(vm, filePath)
                .then(function(time) {
                    if (!saveAndRender(time)) {
                        tryGitHubFallback();
                    }
                });
        } else if (CONFIG.repo !== '') {
            fetchLastModifiedFromGitHub(filePath)
                .then(function(time) {
                    if (!saveAndRender(time)) {
                        tryHeadFallback();
                    }
                });
        } else {
            tryHeadFallback();
        }
    });
};

// 确保插件数组存在
if (typeof $docsify.plugins === 'undefined') {
    $docsify.plugins = [];
}
$docsify.plugins.push(install);
