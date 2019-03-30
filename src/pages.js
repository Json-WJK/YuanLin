module.exports = [
    {
        path: 'pages/index',
        config: {
            navigationBarTitleText: '远邻',
            navigationBarBackgroundColor: "#FA7F59",
            navigationBarTextStyle: "black",
        }
    },
    {
        path: 'pages/user',
        config: {
            navigationBarTitleText: '我的',
            navigationBarBackgroundColor: "bluck",
            navigationBarTextStyle: "black",
        }
    },
    {
        path: 'pages/friend',
        config: {
            navigationBarTitleText: '广场',
            navigationBarBackgroundColor: "bluck",
            navigationBarTextStyle: "black",
            enablePullDownRefresh: true,
            backgroundTextStyle: "dark"
        }
    },
    {
        path: 'packageA/signature',
        config: {
            navigationBarTitleText: '个性签名',
            navigationBarBackgroundColor: "bluck",
            navigationBarTextStyle: "black",
        }
    },
    {
        path: 'packageA/redact',
        config: {
            navigationBarTitleText: '编写中.....',
            navigationBarBackgroundColor: "bluck",
            navigationBarTextStyle: "black",
        }
    },
]
