---
pageClass: blog-page
title: Vue Router 4.x 浏览器前进/后退 & RouteLink 的实现
tags: 
  - web
  - vue
date: 2021-06-18
author: cp3hnu
location: ChangSha
summary: 介绍 Vue Router 4.x 是怎样通过地址栏进行导航和 RouterLink 的实现原理。
---

# Vue Router 4.x 浏览器前进/后退 & RouteLink 的实现

在上一篇 [Vue Router 4.x 实现原理](./2021-05-20-vue-router-theory/) 我们介绍了 Vue Router 编程式导航 `push`、`replace` 的实现原理。这篇文章我们来看看点击浏览器的前进/后退按钮，Vue Router 是怎样实现导航的，以及 RouteLink 组件时怎么实现导航的。

## 前进/后退

我们知道点击浏览器的前进/后退按钮，浏览器会收到 [popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) 事件。Vue Router 就是通过注册 [popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) 事件监听器来实现。

首先在 `createWebHistory ` 方法中注册 [popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) 事件监听器

```typescript {29-40}
window.addEventListener('popstate', popStateHandler)

const popStateHandler = ({ state }) => {
  const to = createCurrentLocation(base, location)
  const from: HistoryLocation = currentLocation.value
  const fromState: StateEntry = historyState.value
  // 确定是前进还是后退
  let delta = 0

  if (state) {
    currentLocation.value = to
    historyState.value = state

    // ignore the popstate and reset the pauseState
    if (pauseState && pauseState === from) {
      pauseState = null
      return
    }
    delta = fromState ? state.position - fromState.position : 0
  } else {
    replace(to)
  }

  // Here we could also revert the navigation by calling history.go(-delta)
  // this listener will have to be adapted to not trigger again and to wait for the url
  // to be updated before triggering the listeners. Some kind of validation function would also
  // need to be passed to the listeners so the navigation can be accepted
  // call all listeners
  listeners.forEach(listener => {
    listener(currentLocation.value, from, {
      delta,
      type: NavigationType.pop,
      direction: delta
        ? delta > 0
          ? NavigationDirection.forward
          : NavigationDirection.back
        : NavigationDirection.unknown,
    })
  })
}

// 通过 `listen` 方法添加 popstate 事件处理器
function listen(callback: NavigationCallback) {
  listeners.push(callback)
}
```

那什么时候调用 `listen` 方法添加 `popstate` 事件处理器呢？通过上一篇 [Vue Router 4.x 实现原理](./2021-05-20-vue-router-theory/) 我们知道在 `install` 方法中，会进行首次导航，导航到用户在浏览器中输入的地址，在首次导航时就会添加 `popstate` 事件处理器。

Vue Router 在编程式导航 `push` 的 `finalizeNavigation ` 方法的最后会调用 `markAsReady` 方法。 `markAsReady` 方法调用 `setupListeners` 方法，添加 `popstate` 事件处理器。

```typescript
function markAsReady(err?: any): void {
  if (ready) return
  ready = true
  setupListeners()
}

function setupListeners() {
  removeHistoryListener = routerHistory.listen((to, _from, info) => {
    // 后面的流程与 `push` 方法一致
    ...
  })
}
```

`popstate` 事件处理流程和 [`push` 方法](/2021/05/20/vue-router-theory/#push-方法)一致。

## go 方法

`go` 方法就是调用 History 的同名方法

```typescript
function go(delta: number) {
  history.go(delta)
}
```

## RouteLink

`RouteLink` 支持两种方式，`<a>` 标签和自定义（`custom`）

```typescript {59}
export const RouterLinkImpl = /*#__PURE__*/ defineComponent({
  name: 'RouterLink',
  props: {
    // 导航地址
    to: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true,
    },
    // push or replace
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    // 是否自定义
    custom: Boolean,
    // [aria-current 属性](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)
    ariaCurrentValue: {
      type: String as PropType<RouterLinkProps['ariaCurrentValue']>,
      default: 'page',
    }
  },

  useLink,

  setup(props, { slots }) {
    const link = reactive(useLink(props))
    const { options } = inject(routerKey)!

    // <a> 标签的 class name
    // link.isExactActive 与 link.isActive 都是 RouteLink to 对应的路由匹配上当前的路由（currentRoute）
    // 区别在于前者是完全匹配，不包括父路由记录，且 params 完全相同
    const elClass = computed(() => ({
      [getLinkClass(
        props.activeClass,
        options.linkActiveClass,
        'router-link-active'
      )]: link.isActive,
      [getLinkClass(
        props.exactActiveClass,
        options.linkExactActiveClass,
        'router-link-exact-active'
      )]: link.isExactActive,
    }))

    return () => {
      // 默认作用域插槽，[v-slot api](https://next.router.vuejs.org/zh/api/#router-link-%E7%9A%84-v-slot)
      // <router-link v-slot="{ route, href, isActive, isExactActive, navigate }"></router-link>
      const children = slots.default && slots.default(link)
      return props.custom
        ? children
        : h(
            'a',
            {
              'aria-current': link.isExactActive
                ? props.ariaCurrentValue
                : null,
              href: link.href,
              // this would override user added attrs but Vue will still add
              // the listener so we end up triggering both
              onClick: link.navigate,
              class: elClass.value,
            },
            children
          )
    }
  }
})
```

我们看到在 59 行，`<a>` 标签的点击事件是 `link.navigate`, 这个 `link` 是执行 `useLink ` 方法的返回值。下面 `useLink ` 方法

>  `useLink ` 方法是 Vue Router 4.x 新增的组合 API 其中的一个 
>
>  `useLink ` 方法返回多个值，这里我们只关注 `navigate` 方法

```typescript {10-12}
export function useLink(props: UseLinkOptions) {
  const router = inject(routerKey)!
  const currentRoute = inject(routeLocationKey)!
  const route = computed(() => router.resolve(unref(props.to)))

  function navigate(
    e: MouseEvent = {} as MouseEvent
  ): Promise<void | NavigationFailure> {
    if (guardEvent(e)) {
      return router[unref(props.replace) ? 'replace' : 'push'](
        unref(props.to)
      ).catch(noop)
    }
    return Promise.resolve()
  }
  
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate,
  }
}

function guardEvent(e: MouseEvent) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute('target')
    if (/\b_blank\b/i.test(target)) return
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) e.preventDefault()

  return true
}
```

我们看到  `navigate` 方法调用 `router`  的 `push` 或者 `replace` 方法来实现导航。但是有一些限制，具体可以看 `guardEvent` 方法的原注释。



