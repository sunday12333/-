var rule = {
    title: '运城第一时间',
    host: 'https://www.0359tv.com',
    url: 'https://www.0359tv.com/web/lm/dysj/list/page_fy.shtml', // 预留分页占位
    searchUrl: '',
    searchable: 0,
    quickSearch: 0,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    },
    timeout: 5000,
    class_name: '第一时间',
    class_url: 'dysj',
    
    // 首页逻辑
    home: function (filter) {
        return JSON.stringify({
            class: [{ type_id: 'dysj', type_name: '第一时间' }]
        });
    },

    // 分类页逻辑 (抓取列表)
    category: function (tid, pg, filter, extend) {
        // 处理分页逻辑：第一页是 list.shtml，后续是 list_1.shtml, list_2.shtml...
        let url = 'https://www.0359tv.com/web/lm/dysj/list.shtml';
        if (parseInt(pg) > 1) {
            url = 'https://www.0359tv.com/web/lm/dysj/list_' + (parseInt(pg) - 1) + '.shtml';
        }
        
        let html = req(url, { headers: this.headers });
        let list = [];
        // 匹配列表中的链接和标题
        let matches = pdfa(html, 'body&&.news-list&&li'); 
        // 如果上述选择器不工作，使用通用正则匹配 <li>...<a href="url">title</a>...</li>
        let reg = /<li>.*?<a href="(.*?)".*?>(.*?)<\/a>/g;
        let m;
        while ((m = reg.exec(html)) !== null) {
            let link = m[1];
            let title = m[2].replace(/•/g, '').trim();
            if (link.startsWith('.')) {
                link = 'https://www.0359tv.com/web/lm/dysj/' + link.replace('./', '');
            }
            list.push({
                vod_id: link,
                vod_name: title,
                vod_pic: 'https://www.0359tv.com/template/yctv/images/logo.png', // 默认Logo
                vod_remarks: '运城视听网'
            });
        }
        return JSON.stringify({ list: list });
    },

    // 详情页逻辑
    detail: function (id) {
        return JSON.stringify({
            list: [{
                vod_id: id,
                vod_name: '第一时间',
                vod_play_from: '官方源',
                vod_play_url: '立即播放$' + id
            }]
        });
    },

    // 播放页逻辑 (解析视频地址)
    play: function (flag, id, flags) {
        let html = req(id, { headers: this.headers });
        // 从 tidePlayer({video:"https://..."}) 中提取 MP4 地址
        let videoUrl = '';
        let reg = /video:"(.*?)"/;
        let m = reg.exec(html);
        if (m) {
            videoUrl = m[1];
        }
        return JSON.stringify({
            parse: 0,
            url: videoUrl,
            header: this.headers
        });
    }
};
