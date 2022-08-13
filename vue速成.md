

# Vue 渐进式JS框架

- View (html,css,templates) 

- ViewModel (JS,Runtimes,Compiler)  ==DOM监听，数据绑定==

- Model (PJSO)



example：

```html
<body>
    // 
    <div id="app">{{ message }}</div>
	// 引入
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
	// 
    <script>
      var app = new Vue({
        el: "#app",
        data: {
          message: "hello",
          arr: [],
          obj: {},
        },
        methods: {
            f:function(...) {
                
            },
        }
      });
    </script>
    
  </body>
```

![image-20220812082556621](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220812082556621.png)

Vue会管理el选项命中的元素及其内部的后代元素



## 1.内容|事件 绑定

- v-html

- v-on

- v-text







### v-text  标签的文本值(textContent)

默认写法会替换==全部==内容,使用差值表达式{{}}可以替换指定内容

内部支持表达式



```html
<div id="app">
      <h1>{{ message + '!' }}</h1>
      <h1 v-text="message + '?' "></h1>
 </div>

<script>
      var app = new Vue({
        el: "#app",
        data: {
          message: "hello"
        },
      });
</script>
```



### v-html  标签的innerHTML

```html

    <div id="app">
      <p v-html="content"></p>
    </div>
    
    
    <script>
      var app = new Vue({
        el: "#app",
        data: {
          content: '<a href="http://www.baidu.com" target="_blank">百度</a>',
        },
      });
    </script>
```



==解析文本使用v-text,需要解析html结构使用v-html==



### v-on: | @ 为元素绑定事件

```html
	<div id="app">
      <input type="button" v-on:click="i" value="click1" />
      <input type="button" @click="i" value="click2" />
      <input type="button" @dblclick="di" value="dblclick" />
    </div>

    <script>
      var app = new Vue({
        el: "#app",
        data: {
          a: "hhh",
        },

        methods: {
          i: function () {
            alert("hello");
          },

          di: function () {
            this.a += "h";
            alert(this.a);
          },
        },
      });
    </script>
```

`v-on:` 等价于 `@`

==this指向改vue对象的data==





自定义参数，事件修饰符

https://cn.vuejs.org/v2/api/#v-on

```html
	<div id="app">
      <input type="button" @click="f(1,2)" value="defination" /><br />
      <input type="text" @keyup.enter="enter" value="modification"/>
    </div>

    <script>
      var app = new Vue({
        el: "#app",
        data: {},
        methods: {
          f: function (p1, p2) {
            alert(p1 + " " + p2);
          },
          enter: function () {
            alert("enter");
          },
        },
      });
    </script>
```



### 应用 counter

```html
    <div id="counter">	
        <div class="c">
          <button @click="sub">-</button>
          <span>{{num}}</span>
          <button @click="add">+</button>
        </div>
    </div>

    <script>
      var a = new Vue({
        el: "#counter",
        data: {
          num: 1,
        },
        methods: {
          sub: function () {
            if (this.num > 0) {
              this.num--;
              console.log(this.num);
            } else {
              alert("too small!");
            }
          },
          add: function () {
            if (this.num < 10) {
              this.num++;
              console.log(this.num);
            } else {
              alert("too big!");
            }
          },
        },
      });
    </script>
```





## 2.显示切换，属性绑定

<ul>
    <li>v-show</li>
    <li>v-if</li>
    <li>v-bind</li>
</ul>



### v-show  修改元素的display,实现显示隐藏

```html
 	<div id="a">
      <img src="./wechat.jpg" v-show="isTrue" /><br />
      <button @click="change" value="change">change</button>
    </div>

    <script>
      var a = new Vue({
        el: "#a",
        data: {
          isTrue: true,
        },
        methods: {
          change: function () {
            this.isTrue = !this.isTrue;
          },
        },
      });
    </script>
```

==指令后面的内容,最终都会解析为布尔值==





### v-if  操纵dom元素来切换显示状态

```html
 	<div id="a">
      <img src="./wechat.jpg" v-if="isTrue" /><br />
      <button @click="change" value="change">change</button>
    </div>

    <script>
      var a = new Vue({
        el: "#a",
        data: {
          isTrue: true,
        },
        methods: {
          change: function () {
            this.isTrue = !this.isTrue;
          },
        },
      });
    </script>
```

在dom树中存除

==频繁的切换v-show,反之使用v-if,前者的切换消耗小==





### v-bind: | :   为元素绑定属性

```html
    <head>
        <style>
          .active {
            border: 1px solid red;
          }
        </style>
    </head>	

	<div id="a">
      <img
        v-bind:src="imgPos"
        :class="{active:isActive}"
        @click="change"
      /><br/>
      <img :src="imgPos" />
    </div>

    <script>
      var a = new Vue({
        el: "#a",
        data: {
          imgPos: "./wechat.jpg",

          isActive: true,
        },
        methods: {
          change: function () {
            this.isActive = !this.isActive;
          },
        },
      });
    </script>
```



`:class="{active:isActive}"` 

名为active的class值是否真取决于isActive的布尔值（动态的增删class）



`v-bind:` 等价于 `:`



## 3.列表循环，表单元素绑定

<ul>
    <li>v-for</li>
    <li>v-model</li>
</ul>



### v-for  根据数据生成列表结构

```html
	<div id="app">
      <ul>
        <li v-for="(item,index) in arr">{{item}} {{index}}</li>
        <li v-for="item in objArr">{{item.a}}</li>
      </ul>
    </div>

    <script>
      var app = new Vue({
        el: "#app",
        data: {
          arr: [1, 2, 3, 4, 5],
          objArr: [{ a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }],
        },
      });
    </script>
```



### v-model 获取和设置表单元素的值(双向数据绑定)

```html
<div id="app">
      <input type="text" v-model="message"></input>
	  <p>{{message}}</p>
	  <textarea v-model="message"></textarea>
 </div>

<script>
      var app = new Vue({
        el: "#app",
        data: {
          message: "hello"
        },
      });
</script>
```





### 应用 notebook

[小黑记事本](https://www.bilibili.com/video/BV1HE411e7vY?p=18&share_source=copy_web&vd_source=6f7c3eb307225bf097074bea8a4701de)



## Componet 可重复使用的模板

0.配置

main.js

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(ElementUI,{size: "small"});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

```



1.新建component

/src/components/Test.vue

```vue
<template>
	<div>{{a}}</div>
</template>

<script>
	export default {
		name: "Test",
		props: {
			a: String
		}
	}
</script>
```



2.view中引入使用

/src/views/HelloWorld.vue

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
	<Test a="hhhh"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Test from '../components/Test.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
	Test
  }
}
</script>
```



3.注册view

/src/router/index.js

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  ...
]

...

```





## vue-demo 创建

1.主目录cmd入

```shell
vue create vue-demo
```

2.space选择

![image-20220813154749010](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220813154749010.png)



3.启动

```shell
cd vue-demo
npm run serve
```



4.安装element-ui

```shell
npm i element-ui -S
```

package.json会多出东西



5.引入element-ui

main.js中：

```js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI,{size: "small"});
```



# Axios 前端通信框架

```html

  <body>
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

    <div id="app">
      <input type="button" value="get" @click="r" />
      <input type="button" value="post" class="post" />
    </div>

    <script>
      var app = new Vue({
        el: "#app",
        methods: {
          r: function () {
            axios
              .get("https://api.it120.cc/rest/centerUser/info")
              .then(
                (res) => {
                console.log(res.status);
              },
              	(err) => {
                console.log(err);
              }
          },
        },
      });
    </script>
  </body>
```

