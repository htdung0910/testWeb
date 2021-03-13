export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: "/user",
            redirect: "/user/login"
          },
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
              },
              {
                name: 'list.brand-list',
                icon: 'TagsFilled',
                path: '/brand',
                component: './Brand',
              },
              {
                name: 'list.location-list',
                icon: 'RadarChartOutlined',
                path: '/location',
                component: './Location',
              },
              {
                name: 'list.campaign-list',
                icon: 'GlobalOutlined',
                path: '/campaign',
                component: './Campaign',
              },
              {
                name: 'list.device-list',
                icon: 'FundProjectionScreen',
                path: '/devies',
                component: './Device',
              },
              {
                name: 'list.media-list',
                icon: 'PictureOutlined',
                path: '/medias',
                component: './Media',
              },
              {
                name: 'list.playlist-list',
                icon: 'PlaySquareOutlined',
                path: '/playlist',
                component: './Playlist',
              },
              {
                name: 'list.scenario-list',
                icon: 'ContainerOutlined',
                path: '/scenario',
                component: './Scenario',
              },
              {
                path: "/profile",
                name: "profile",
                icon: "profile",
                routes: [
                   {
                    path: '/',
                    redirect: '/profile/basic',
                  },
                  {
                    name: 'basic',
                    icon: 'smile',
                    path: '/profile/basic',
                    component: './Profile/basic',
                  },
                  {
                    name: 'wallet',
                    icon: 'smile',
                    path: '/profile/wallet',
                    component: './profile/wallet',
                  },
                ]
              },
              {
                component: './404',
              },
            ],
          },
          {
              name: 'exception',
              icon: 'warning',
              path: '/exception',
              routes: [
                {
                  path: '/',
                  redirect: '/exception/403',
                },
                {
                  name: '403',
                  icon: 'smile',
                  path: '/exception/403',
                  component: './exception/403',
                },
                {
                  name: '404',
                  icon: 'smile',
                  path: '/exception/404',
                  component: './exception/404',
                },
                {
                  name: '500',
                  icon: 'smile',
                  path: '/exception/500',
                  component: './exception/500',
                },
              ],
            },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
