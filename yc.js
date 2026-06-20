var rule = {
    title: '运城第一时间',
    host: 'https://www.0359tv.com',
    headers: { 'User-Agent': 'Mozilla/5.0' },
    // 首页分类
    home: function (f) {
        return JSON.stringify({ class: [{ type_id: '1', type_name: '最新节目' }] });
    },
    // 抓取列表
    category: function (tid, pg, f, e) {
        var url = 'https://www.0359tv.com/web/lm/dysj/list.shtml';
        if (pg > 1) url = 'https://www.0359tv.com/web/lm/dysj/list_' + (pg - 1) + '.shtml';
        var html = req(url, { headers: this.headers });
        var list = [];
        // 匹配 <li>...<a href="地址">标题</a>...</li>
        var reg = /<li>[\s\S]*?<a href="(.*?)".*?>([\s\S]*?)<\/a>/g;
        var m;
        while ((m = reg.exec(html)) !== null) {
            var v_url = m[1];
            var title = m[2].replace(/•/g, '').trim();
            if (v_url.includes('detail')) {
                // 补全相对路径
                if (v_url.startsWith('.')) v_url = 'https://www.0359tv.com/web/lm/dysj' + v_url.substring(1);
                list.push({
                    vod_id: v_url,
                    vod_name: title,
                    vod_pic: 'https://www.0359tv.com/template/yctv/images/logo.png',
                    vod_remarks: '运城视听网'
                });
            }
        }
        return JSON.stringify({ list: list });
    },
    // 详情页
    detail: function (id) {
        return JSON.stringify({
            list: [{ vod_id: id, vod_name: '第一时间', vod_play_from: '官方', vod_play_url: '播放$' + id }]
        });
    },
    // 解析视频
    play: function (flag, id, flags) {
        var html = req(id, { headers: this.headers });
        var m = html.match(/video\s*:\s*"(.*?)"/);
        return JSON.stringify({ parse: 0, url: m ? m[1] : '', header: this.headers });
    }
};
