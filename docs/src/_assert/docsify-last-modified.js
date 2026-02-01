var CONFIG = {
    repo: '',
    basePath: 'docs/',
    preString: 'Last modified:',
    dateFormat: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}',
    align: 'right',
};

// 缓存已获取的日期，避免重复请求 GitHub API
var dateCache = {};

var install = function (hook, vm) {
    var opts = vm.config.lastModified || CONFIG;
    CONFIG.repo = opts.repo && typeof opts.repo === 'string' ? opts.repo : CONFIG.repo;
    CONFIG.basePath = opts.basePath && typeof opts.basePath === 'string' ? opts.basePath : CONFIG.basePath;
    CONFIG.preString = opts.preString && typeof opts.preString === 'string' ? opts.preString : CONFIG.preString;
    CONFIG.dateFormat = opts.dateFormat && typeof opts.dateFormat === 'string' ? opts.dateFormat : CONFIG.dateFormat;
    CONFIG.align = opts.align && typeof opts.align === 'string' ? opts.align : CONFIG.align;

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

        // 显示加载中状态
        element.textContent = CONFIG.preString + '加载中...';

        if (CONFIG.repo !== '') {
            // 对路径进行 URL 编码以支持中文文件名
            var encodedPath = encodeURIComponent(CONFIG.basePath + filePath);
            var date_url = 'https://api.github.com/repos/' + CONFIG.repo + '/commits?per_page=1&path=' + encodedPath;

            // 设置超时控制
            var controller = new AbortController();
            var timeoutId = setTimeout(function() { controller.abort(); }, 5000);

            fetch(date_url, { signal: controller.signal })
                .then(function(response) {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error('API request failed');
                    }
                    return response.json();
                })
                .then(function(commits) {
                    var time = '';
                    if (commits && commits.length > 0 && commits[0].commit) {
                        time = tinydate(CONFIG.dateFormat)(new Date(commits[0]['commit']['committer']['date']));
                        // 缓存结果
                        dateCache[filePath] = time;
                    }
                    // 确保元素仍然存在（用户可能已切换页面）
                    var el = document.getElementById('last-modified');
                    if (el) {
                        el.textContent = time ? (CONFIG.preString + time) : '';
                    }
                })
                .catch(function(error) {
                    clearTimeout(timeoutId);
                    console.warn('获取最后修改时间失败:', error.message);
                    // 请求失败时清空显示，而不是显示占位符
                    var el = document.getElementById('last-modified');
                    if (el) {
                        el.textContent = '';
                    }
                });
        } else {
            element.textContent = '';
        }
    });
};

// 确保插件数组存在
if (typeof $docsify.plugins === 'undefined') {
    $docsify.plugins = [];
}
$docsify.plugins.push(install);