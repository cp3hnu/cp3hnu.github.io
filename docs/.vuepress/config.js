module.exports = {
  title: 'Study & Product',
  description: 'My Home Page',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  themeConfig: {
    logo: '/favicon.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'NoteBook', link: '/notebook/' },
      { text: 'GitHub', link: 'https://github.com/cp3hnu' },
      { text: 'About', link: '/about/' },
    ],
    sidebar: {
      '/notebook/advanced-swift/': [
        {
          title: 'Advanced Swift',
          collapsable: false,
          sidebarDepth: 1,
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
          collapsable: false,
          sidebarDepth: 1,
          children: [
            {
              title: '2017',
              collapsable: true,
              sidebarDepth: 1,
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
              sidebarDepth: 1,
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
    //sidebar: 'auto',
    sidebarDepth: 1,
    lastUpdated: false,
    smoothScroll: true
  },
  markdown: {
    lineNumbers: true,
    toc: {
      includeLevel: [2, 3, 4]
    },
  }
}