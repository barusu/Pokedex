<template>
  <main class="check">
    <p>
      <o-button type="info" @click="loadData">load</o-button>
      <o-button type="success" :disabled="!data.length" @click="checkbase(0)">check</o-button>
      <o-button type="success" :disabled="!data.length" @click="checkbaseimg(0)">check base</o-button>
      <o-button type="success" :disabled="!data.length" @click="checkreformimg(0)">check reform</o-button>
      <o-button type="success" :disabled="!data.length" @click="checkwhiteimg(0)">check white</o-button>
      <o-button type="success" :disabled="!data.length" @click="checkskinimg(0, 0)">check skin</o-button>
      <o-button type="error" @click="list = []">clear</o-button>
      <span>{{poi}}</span>
    </p>
    <ul>
      <li v-for="i in list" @click="$router.push({name: 'azurlane_view', params: {code: i.code}})"><span>{{i.code}} - {{i.zh}}</span><span>{{i.msg}}</span></li>
    </ul>
  </main>
</template>

<script>
  import $ from '@/libs/ajax';

  export default {
    data() {
      return {
        data: [],
        list: [],
        poi: 0
      };
    },
    methods: {
      loadData() {
        $.get('resource/game/list', {type: 3}, data => {
          if(Array.isArray(data)) {
            this.data = data.map(i => ({id: i.id, code: i.a, type: i.b, rare: i.c, name: i.d, zh: i.e, info: JSON.parse(i.f)}));
          }
        });
      },
      checkbase(poi) {
        if(poi >= this.data.length) return;
        this.poi = poi;
        if(this.data[poi].rare) {
          var t = this.data[poi], img = document.createElement('img');
          if(!t.name || !t.zh) this.list.push({code: t.code, zh: t.zh, msg: '名称缺失'});
          img.onload = () => {this.checkbase(poi + 1); };
          img.onerror = () => {
            this.list.push({code: t.code, zh: t.zh, msg: '基础预览图缺失'});
            this.checkbase(poi + 1);
          };
          img.src = `/static/base/${t.code}.png`;
        }else {
          this.checkbase(poi + 1);
        }
      },
      checkbaseimg(poi) {
        if(poi >= this.data.length) return;
        this.poi = poi;
        if(this.data[poi].rare) {
          var t = this.data[poi], img = document.createElement('img');
          img.onload = () => {this.checkbaseimg(poi + 1); };
          img.onerror = () => {
            this.list.push({code: t.code, zh: t.zh, msg: '基础立绘缺失'});
            this.checkbaseimg(poi + 1);
          };
          img.src = `/static/base/${t.code}.jpg`;
        }else {
          this.checkbaseimg(poi + 1);
        }
      },
      checkreformimg(poi) {
        if(poi >= this.data.length) return;
        this.poi = poi;
        if(this.data[poi].rare && this.data[poi].info && this.data[poi].info.reform) {
          var t = this.data[poi], img = document.createElement('img'), imgmin = document.createElement('img');
          img.onload = () => {this.checkreformimg(poi + 1); };
          img.onerror = () => {
            this.list.push({code: t.code, zh: t.zh, msg: '改造立绘缺失'});
            this.checkreformimg(poi + 1);
          };
          imgmin.onerror = () => {
            this.list.push({code: t.code, zh: t.zh, msg: '改造预览图缺失'});
          };
          img.src = `/static/reform/${t.code}.jpg`;
          imgmin.src = `/static/reform/3${t.code}.png`;
        }else {
          this.checkreformimg(poi + 1);
        }
      },
      checkwhiteimg(poi) {
        if(poi >= this.data.length) return;
        this.poi = poi;
        if(this.data[poi].rare && this.data[poi].info && this.data[poi].info.white) {
          var t = this.data[poi], img = document.createElement('img'), imgmin = document.createElement('img');
          img.onload = () => {this.checkwhiteimg(poi + 1); };
          img.onerror = () => {
            this.list.push({code: t.code, zh: t.zh, msg: '婚纱立绘缺失'});
            this.checkwhiteimg(poi + 1);
          };
          imgmin.onerror = () => {
            this.list.push({code: t.code, zh: t.zh, msg: '婚纱预览图缺失'});
          };
          img.src = `/static/white/${t.code}.jpg`;
          imgmin.src = `/static/white/${t.code}.png`;
        }else {
          this.checkwhiteimg(poi + 1);
        }
      },
      checkskinimg(poi, index) {
        if(poi >= this.data.length) return;
        this.poi = poi;
        if(this.data[poi].rare && this.data[poi].info && this.data[poi].info.skin) {
          index++;
          var t = this.data[poi], img = document.createElement('img'), imgmin = document.createElement('img');
          if(index >= t.info.skin) {
            this.checkskinimg(poi + 1, 0);
            return;
          }
          img.onload = () => {this.checkskinimg(poi, index); };
          img.onerror = () => {
            this.list.push({code: t.code, zh: t.zh, msg: `换装${index}立绘缺失`});
            this.checkskinimg(poi, index);
          };
          imgmin.onerror = () => {
            this.list.push({code: t.code, zh: t.zh, msg: `换装${index}预览图缺失`});
          };
          img.src = `/static/skin/${t.code}-${index}.jpg`;
          imgmin.src = `/static/skin/${t.code}-${index}.png`;
        }else {
          this.checkskinimg(poi + 1, 0);
        }
      }
    },
    mounted() {
      this.loadData();
    }
  };
</script>

<style lang="scss">
  .check {
    font-size: 13px;
    padding: 1em 5%;
    li {
      text-align: left;
      border-bottom: 1px solid #eee;
      span {
        display: inline-block;
        min-width: 15em;
        line-height: 2;
      }
    }
  }
</style>