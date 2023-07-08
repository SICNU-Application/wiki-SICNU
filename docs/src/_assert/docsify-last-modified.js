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
        var time = '{docsify-updated}';
        if (CONFIG.repo !== '') {
            var date_url = 'https://api.github.com/repos/' + CONFIG.repo + '/commits?per_page=1';
            
            if (CONFIG.basePath !== '') {
                date_url = date_url + '&path=' + CONFIG.basePath + vm.route.file;
            }
            fetch(date_url).then((response) => {
              return response.json();
            }).then((commits) => {
                if (commits.length > 0) {
                    time = tinydate(CONFIG.dateFormat)(new Date(commits[0]['commit']['committer']['date']));
                }
              document.getElementById('last-modified').textContent = CONFIG.preString + time;
            });
        } else {
            document.getElementById('last-modified').textContent = CONFIG.preString + time;
        }
        return (html + '\n----\n' + '<div align= ' + CONFIG.align + '><span id="last-modified"></span></div>');
    });
};

$docsify.plugins = [].concat(install, $docsify.plugins);