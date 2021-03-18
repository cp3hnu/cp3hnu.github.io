module.exports = {
  title: 'Study & Product',
  description: 'My Home Page',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  evergreen: true,
  plugins: ['@vuepress/back-to-top'],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Notebook', link: '/notebook/' },
      { text: 'About', link: '/about/' },
      { text: 'GitHub', link: 'https://github.com/cp3hnu' },
    ],
    directories: [
      {
        id: 'blog',
        dirname: 'blog',
        path: '/blog/',
      },
    ],
    sitemap: {
      hostname: 'https://www.joylearn123.com/'
    },
    sidebar: {
      '/notebook/advanced-swift/': [
        {
          title: 'Advanced Swift',
          path: '/notebook/advanced-swift/',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            'book/chapter-2',
            'book/chapter-3',
            'book/chapter-4',
            'book/chapter-5',
            'book/chapter-7',
            'book/chapter-8',
            'book/chapter-9',
            'book/chapter-10',
            'book/chapter-11',
          ]
        }
      ],
      '/notebook/wwdc/': [
        {
          title: 'WWDC',
          path: '/notebook/wwdc/',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            {
              title: '2017',
              collapsable: true,
              sidebarDepth: 0,
              children: [
                '2017/documents/220',
                '2017/documents/223',
                '2017/documents/225',
                '2017/documents/401',
              ]
            },
            {
              title: '2019',
              collapsable: true,
              sidebarDepth: 0,
              children: [
                '2019/documents/206',
                '2019/documents/212',
                '2019/documents/214',
                '2019/documents/220',
                '2019/documents/224',
                '2019/documents/227',
                '2019/documents/234',
                '2019/documents/235',
                '2019/documents/246',
                '2019/documents/256',
                '2019/documents/258',
                '2019/documents/259',
                '2019/documents/401',
                '2019/documents/402',
                '2019/documents/403',
                '2019/documents/408',
                '2019/documents/410',
                '2019/documents/413',
                '2019/documents/416',
                '2019/documents/511',
              ]
            }
          ]
        }
      ],
      // fallback
      '/': 'auto'
    },
    smoothScroll: true
  },
  markdown: {
    lineNumbers: true,
    toc: {
      includeLevel: [2, 3, 4]
    },
  }
}