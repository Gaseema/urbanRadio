$(document).foundation()
var RB = RB || {};

RB.tabs = (function () {
    "use strict";
    var that, currIndex, prevIndex, currHref, currUrl, currReq;
    return {
        settings: {
            ele: '#Tabs',
            tabContent: '.tabs-navcontent .navcontent',
            hashMode: true,
            firstHash: false
        },
        initalTab: function () {
            currHref = window.location.hash;
            //dont set hash on load for first hash
            if (!currHref && !this.settings.firstHash) {
                currIndex = 0;
                this.setContent();
                return true;
            }
            //set hash to first list item
            if (!currHref) {
                currHref = $(this.settings.ele).children('ul').find('li').first().find('a').attr('href');
                currIndex = 0;
                currUrl = $(this.settings.ele).children('ul').find('li').first().attr('data-url');
                this.setContent();
                return true;
            }
            //load correct content from hash
            currIndex = $(this.settings.ele).children('ul').find('li')
                .find('a[href="' + currHref + '"]')
                .closest('li')
                .index();
            currUrl = $(this.settings.ele).children('ul').find('li').eq(currIndex).attr('data-url');
            currHref = $(this.settings.ele).children('ul').find('li').eq(currIndex).find('a').attr('href');
            this.setContent();
        },
        uiBinding: function () {
            that = this;
            $(this.settings.ele).children('ul').find('li').on('click', function (e) {
                if (currReq) {
                    currReq.abort();
                }
                prevIndex = currIndex;
                currIndex = $(this).index();

                if (prevIndex != currIndex) {
                    currUrl = $(this).attr('data-url');
                    currHref = $(this).find('a').attr('href');
                    that.setContent();
                }
                e.preventDefault();
            })
        },
        setContent: function () {
            $(this.settings.ele).children('ul').find('li').removeClass('active');
            $(this.settings.ele).children('.tabs-content').children('.content').removeClass('active');

            $(this.settings.ele).children('ul').find('li').eq(currIndex).addClass('active');
            $(this.settings.ele).children('.tabs-content').children('.content').eq(currIndex).addClass('active');

            if (this.settings.hashMode && currHref) {
                window.location.hash = currHref;
            }
            if (currUrl) {
                this.doAjax()
            }
        },
        doAjax: function () {
            currReq = $.ajax({
                url: currUrl,
                dataType: 'html',
                beforeSend: function () {
                    console.log("before send");
                },
                success: function (data) {
                    $('.tabs-content .active').html(data);
                    console.log(data);

                },
                fail: function (jqxhr) {
                    console.log(jqxhr);
                }
            })
        },
        init: function (options) {
            console.clear();
            this.initalTab();
            this.uiBinding();
        }
    };
})();

$(document).on('ready', function () {
    RB.tabs.init();
});
