var CONFIG = {
    repo: '',
    basePath: 'docs/',
    preString: 'Last modified:',
    dateFormat: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}',
    align: 'right',
};

var install = function (hook, vm) {
    var opts = vm.config.lastModified || CONFIG;
    CONFIG.repo = opts.repo && typeof opts.repo === 'string' ? opts.repo : CONFIG.repo;
    CONFIG.basePath = opts.basePath && typeof opts.basePath === 'string' ? opts.basePath : CONFIG.basePath;
    CONFIG.preString = opts.preString && typeof opts.preString === 'string' ? opts.preString : CONFIG.preString;
    CONFIG.dateFormat = opts.dateFormat && typeof opts.dateFormat === 'string' ? opts.dateFormat : CONFIG.dateFormat;
    CONFIG.align = opts.align && typeof opts.align === 'string' ? opts.align : CONFIG.align;

    hook.beforeEach(function(html) {
        return (html + '\n----\n' + '<div align= ' + CONFIG.align + '><span id="last-modified">' + CONFIG.preString + '加载中...</span></div>');
    });

    hook.doneEach(function() {
        console.log('docsify-last-modified: doneEach hook triggered');
        var time = '{docsify-updated}';
        var element = document.getElementById('last-modified');
        
        if (!element) {
            console.error('docsify-last-modified: element #last-modified not found');
            return;
        }

        console.log('docsify-last-modified: repo =', CONFIG.repo);
        console.log('docsify-last-modified: file =', vm.route.file);

        if (CONFIG.repo !== '') {
            var date_url = 'https://api.github.com/repos/' + CONFIG.repo + '/commits?per_page=1';
            
            if (CONFIG.basePath !== '') {
                // 对路径进行 URL 编码以支持中文文件名
                var filePath = encodeURI(CONFIG.basePath + vm.route.file);
                date_url = date_url + '&path=' + filePath;
            }
            
            console.log('docsify-last-modified: fetching from', date_url);
            
            fetch(date_url)
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('GitHub API request failed: ' + response.status);
                    }
                    return response.json();
                })
                .then(function(commits) {
                    if (commits && commits.length > 0) {
                        time = tinydate(CONFIG.dateFormat)(new Date(commits[0]['commit']['committer']['date']));
                        console.log('docsify-last-modified: formatted time =', time);
                    } else {
                        time = '未知';
                        console.warn('docsify-last-modified: no commits found');
                    }
                    element.textContent = CONFIG.preString + time;
                })
                .catch(function(error) {
                    console.error('docsify-last-modified error:', error);
                    element.textContent = CONFIG.preString + '获取失败';
                });
        } else {
            console.warn('docsify-last-modified: CONFIG.repo is empty');
            element.textContent = CONFIG.preString + time;
        }
    });
};

// 确保插件数组存在
if (typeof $docsify.plugins === 'undefined') {
    $docsify.plugins = [];
}
$docsify.plugins.push(install);