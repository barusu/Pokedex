<template>
  <main class="azurlane" ref="content">
    <div class="filter">
      <button type="button" :class="{'on': type == 'base'}" @click="type = 'base'">通常</button>
      <button type="button" :class="{'on': type == 'sp'}" @click="type = 'sp'">联动</button>
      <button type="button" :class="{'on': type == 'skin'}" @click="type = 'skin'">皮肤</button>
      <button type="button" :class="{'on': type == 'reform'}" @click="type = 'reform'">改造</button>
      <button type="button" :class="{'on': type == 'white'}" @click="type = 'white'">婚纱</button>
    </div>
    <div class="content clearfix" :style="contentStyle">
      <div class="item" :class="[i.type, i.rare, {'unknown': !i.rare}]" v-for="i in Data" :data-code="i.id" @click="$router.push({name: 'azurlane_view', params: {code: i.code}})">
        <img v-if="i.rare" :src="i.img || '/static/base/' + i.code + '.png'" alt="">
        <span class="code">
          <span :class="'n' + i.codes[0]"></span>
          <span :class="'n' + i.codes[1]"></span>
          <span :class="'n' + i.codes[2]"></span>
        </span>
        <span class="name"><span v-html="i.zh"></span></span>
      </div>
    </div>
  </main>
</template>

<script>
  /* eslint-disable indent */
  import data from '@/libs/azurlane.json';
  import $ from '@/libs/ajax';

  const reformMap = {
    N: 'R',
    R: 'SR',
    SR: 'SSR',
    SSR: 'UR'
  };

  export default {
    components: {},
    data() {
      return {
        data: data,
        colnum: 0,
        type: sessionStorage.type || 'base'
      };
    },
    watch: {
      type() {
        sessionStorage.type = this.type;
      }
    },
    methods: {},
    computed: {
      Data() {
        switch(this.type) {
          case 'sp':
          return this.data.filter(i => i.id > 698);
          case 'base':
          return this.data.filter(i => i.id < 699);
          case 'skin':
          var list = [];
          this.data.filter(i => i.info && i.info.skin).forEach(i => {
            var poi = 0;
            while(poi++ < i.info.skin) {
              list.push({
                code: i.code,
                codes: i.codes,
                type: i.type,
                rare: i.rare,
                name: i.info.skins && i.info.skins[poi - 1].name || '',
                zh: i.info.skins && i.info.skins[poi - 1].zh || '',
                img: `/static/skin/${i.code}-${poi}.png`
              });
            }
          });
          return list;
          case 'white':
          return this.data.filter(i => i.info && i.info.white).map(i => ({
            code: i.code,
            codes: i.codes,
            type: i.type,
            rare: i.rare,
            name: i.info.white_name,
            zh: i.info.white_zh,
            img: `/static/white/${i.code}.png`
          }));
          case 'reform':
          return this.data.filter(i => i.info && i.info.reform).map(i => ({
            code: i.code,
            codes: i.codes,
            type: i.type,
            rare: reformMap[i.rare],
            name: i.name + '改',
            zh: i.zh + '改',
            img: `/static/reform/3${i.code}.png`
          }));
          default: return this.data;
        }
      },
      contentStyle() {
        return {
          width: this.colnum * 85 + 'px'
        };
      }
    },
    mounted() {
      document.body.className = 'azurlane';
      $.get('resource/game/list', {type: 3}, data => {
        if(Array.isArray(data)) {
          this.data = data.map(i => ({id: i.id, code: i.a, codes: i.a.split('').slice(-3), type: i.b, rare: i.c, name: i.d, zh: i.e, info: JSON.parse(i.f)}));
        }
      });
      this.$nextTick(() => {
        this.colnum = Math.floor(this.$refs.content.clientWidth * .95 / 85);
      });
    },
    beforeDestroy() {}
  };
</script>

<style lang="scss">
  main.azurlane {
    .filter {
      font-size: .16rem;
      padding-top: .1rem;
      button {
        width: 4em;
        line-height: 2;
        border-radius: 5px;
        background-image: linear-gradient(0deg, #fdba50 0%, #fdba50 49%, #feee82 51%, #feee82 100%);
        background-clip: padding-box;
        color: #6d4c41;
        font-weight: 600;
        border-color: rgba(0,0,0,.2);
        filter: grayscale(100%);
        cursor: pointer;
        transition: all .35s;
        &.on {
          filter: grayscale(0%);
        }
      }
    }
    .content {
      padding-top: .05rem;
      margin-left: auto;
      margin-right: auto;
    }
    .item {
      position: relative;
      float: left;
      width: 79px;
      height: 112px;
      margin: 3px;
      padding: 4px 4px 3px;
      cursor: pointer;
      img {
        position: relative;
        width: 100%;
        z-index: -1;
      }
      .name {
        position: absolute;
        top: 86px; left: 0;
        display: block;
        width: 69px;
        margin: 0 5px;
        font-size: 12px;
        color: #fff;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        span {
          font-weight: 700;
        }
      }
      .code {
        position: absolute;
        top: 5px; right: 5px;
        font-size: 0;
        font-weight: 700;
        line-height: 1;
        color: #fdba50;
        background-image: linear-gradient(0deg, #feee82 0%, #fdba50 50%, #fff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke: 0.25px #333;
        > span {
          display: inline-block;
          width: 8px;
          height: 12px;
          background: no-repeat center / contain;
        }
        .n0 {background-image: url(../../assets/number/0.png); }
        .n1 {background-image: url(../../assets/number/1.png); }
        .n2 {background-image: url(../../assets/number/2.png); }
        .n3 {background-image: url(../../assets/number/3.png); }
        .n4 {background-image: url(../../assets/number/4.png); }
        .n5 {background-image: url(../../assets/number/5.png); }
        .n6 {background-image: url(../../assets/number/6.png); }
        .n7 {background-image: url(../../assets/number/7.png); }
        .n8 {background-image: url(../../assets/number/8.png); }
        .n9 {background-image: url(../../assets/number/9.png); }
      }
      &.DD,
      &.CL,
      &.CA,
      &.BB,
      &.BM,
      &.BC,
      &.BBV,
      &.CV,
      &.CVL,
      &.AR {
        &::after {
          content: '';
          position: absolute;
          top: 4px; left: 4px;
          width: 25px;
          height: 14px;
          background: no-repeat top left / contain;
        }
      }
      &.unknown {
        background: no-repeat url(../../assets/unknown.png) center center / cover;
        pointer-events: none;
        &::after {content: none; }
      }
      &.DD {
        &::after {background-image: url(../../assets/type_dd.png); }
      }
      &.CVL {
        &::after {background-image: url(../../assets/type_cvl.png); }
      }
      &.CV {
        &::after {background-image: url(../../assets/type_cv.png); }
      }
      &.CL {
        &::after {background-image: url(../../assets/type_cl.png); }
      }
      &.CA {
        &::after {background-image: url(../../assets/type_ca.png); }
      }
      &.BC,
      &.BM,
      &.BBV,
      &.BB {
        &::after {background-image: url(../../assets/type_bb.png); }
      }
      &.AR {
        &::after {background-image: url(../../assets/type_ar.png); }
      }
      &.N,
      &.R,
      &.SR,
      &.SSR {
        background: no-repeat center center / cover;
        &::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          background: no-repeat center center / 72px;
          z-index: -2;
        }
      }
      &.N {
        background-image: url(../../assets/rare_n.png);
        &::before {background-image: url(../../assets/bg_n.png); }
      }
      &.R {
        background-image: url(../../assets/rare_r.png);
        &::before {background-image: url(../../assets/bg_r.png); }
      }
      &.SR {
        background-image: url(../../assets/rare_sr.png);
        &::before {background-image: url(../../assets/bg_sr.png); }
      }
      &.SSR {
        background-image: url(../../assets/rare_ssr.png);
        &::before {background-image: url(../../assets/bg_ssr.png); }
      }
    }
  }
</style>