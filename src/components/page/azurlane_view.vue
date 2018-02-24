<template>
  <main class="azurlane-view clearfix" ref="content">
    <div class="illustrated-handbook">
      <div class="tabs">
        <div class="tab" :class="{'on': type == 'base'}" @click="type = 'base'">通常</div>
        <div class="tab" :class="{'on': type == 'reform', 'disabled': !info.reform}" @click="type = 'reform'">改造</div>
        <div class="tab" :class="{'on': type == 'white', 'disabled': !info.white}" @click="type = 'white'">婚纱</div>
        <div class="tab" :class="{'on': type == 'skin', 'disabled': !info.skin}" @click="type = 'skin'">换装</div>
        <div class="thumbnail">
          <div class="scroll-wrapper">
            <div class="item" :class="{'active': index == imgIndex}" v-for="(i, index) in List" @click="switchImg(i, index)"><img :src="i.url" alt=""></div>
            <div class="bg" :style="{'top': imgIndex * 55 + 'px'}"></div>
          </div>
        </div>
      </div>
      <div class="content">
        <img :src="imgsrc" alt="">
      </div>
    </div>
    <div class="info-wrapper">
      <div class="radar" ref="radar"></div>
      <div class="info-content">
        <div class="drop">
          <table>
            <thead>
              <tr>
                <th>建造時間</th>
                <th>入手クエスト</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-html="info.buildTime || '-'"></td>
                <td v-html="info.getWay"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p>
        <o-switch v-model="info.reform" class="s">改造</o-switch>
        <o-switch v-model="info.white" class="s">婚纱</o-switch>
        <o-switch v-model="Skin1" class="s">换装1</o-switch>
        <o-switch v-model="Skin2" class="s">换装2</o-switch>
        <o-switch v-model="Skin3" class="s">换装3</o-switch>
      </p>
      <p><o-button type="info" @click="save">更新</o-button><o-button type="" @click="back">返回</o-button></p>
      <p><o-input label="建造时间" v-model="info.buildTime"></o-input></p>
      <p><o-input label="入手途径" v-model="info.getWay"></o-input></p>
      <p><o-input label="名前" v-model="form.d"></o-input></p>
      <p><o-input label="名称" v-model="form.e"></o-input></p>
      <p v-if="info.white"><o-input label="婚纱名前" v-model="info.white_name"></o-input></p>
      <p v-if="info.white"><o-input label="婚纱名称" v-model="info.white_zh"></o-input></p>
      <p v-if="Skin1"><o-input label="换装1名前" v-model="info.skins[0].name"></o-input></p>
      <p v-if="Skin1"><o-input label="换装1名称" v-model="info.skins[0].zh"></o-input></p>
      <p v-if="Skin2"><o-input label="换装2名前" v-model="info.skins[1].name"></o-input></p>
      <p v-if="Skin2"><o-input label="换装2名称" v-model="info.skins[1].zh"></o-input></p>
      <p v-if="Skin3"><o-input label="换装3名前" v-model="info.skins[2].name"></o-input></p>
      <p v-if="Skin3"><o-input label="换装3名称" v-model="info.skins[2].zh"></o-input></p>
      <p class="av">
        <o-input class="item" label="耐久" v-model="info.av[2]"></o-input>
        <o-input class="item" label="炮击" v-model="info.av[0]"></o-input>
        <o-input class="item" label="防空" v-model="info.av[3]"></o-input>
        <o-input class="item" label="雷击" v-model="info.av[1]"></o-input>
        <o-input class="item" label="航空" v-model="info.av[5]"></o-input>
        <o-input class="item" label="填装" v-model="info.av[6]"></o-input>
        <o-input class="item" label="机动" v-model="info.av[4]"></o-input>
        <o-input class="item" label="消耗" v-model="info.oil"></o-input>
        <o-input class="item" label="航速" v-model="info.speed"></o-input>
      </p>
      <p class="av" v-if="info.reform">
        <o-input class="item" label="耐久" v-model="info.avre[2]"></o-input>
        <o-input class="item" label="炮击" v-model="info.avre[0]"></o-input>
        <o-input class="item" label="防空" v-model="info.avre[3]"></o-input>
        <o-input class="item" label="雷击" v-model="info.avre[1]"></o-input>
        <o-input class="item" label="航空" v-model="info.avre[5]"></o-input>
        <o-input class="item" label="填装" v-model="info.avre[6]"></o-input>
        <o-input class="item" label="机动" v-model="info.avre[4]"></o-input>
        <o-input class="item" label="航速" v-model="info.speedre"></o-input>
      </p>
      <p><o-button type="info" @click="save">更新</o-button><o-button type="" @click="back">返回</o-button></p>
    </div>
  </main>
</template>

<script>
  import data from '@/libs/azurlane.json';
  import $ from '@/libs/ajax';
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/chart/radar';

  const maxAv = {
    DD: [
      {name: '火力', min: 0, max: 125},
      {name: '雷装', min: 0, max: 525},
      {name: '耐久', min: 0, max: 2500},
      {name: '对空', min: 0, max: 250},
      {name: '回避', min: 0, max: 250},
      {name: '填装', min: 0, max: 250}
    ],
    CVL: [
      {name: '航空', min: 0, max: 400},
      {name: '耐久', min: -1000, max: 8000},
      {name: '对空', max: 400},
      {name: '回避', max: 250},
      {name: '填装', min: 0, max: 200}
    ],
    CL: [
      {name: '火力', min: 0, max: 125},
      {name: '雷装', min: 0, max: 525},
      {name: '耐久', min: 0, max: 2500},
      {name: '对空', min: 0, max: 250},
      {name: '回避', min: 0, max: 250},
      {name: '填装', min: 0, max: 250}
    ],
    CA: [
      {name: '火力', min: 0, max: 125},
      {name: '雷装', min: 0, max: 525},
      {name: '耐久', min: 0, max: 2500},
      {name: '对空', min: 0, max: 250},
      {name: '回避', min: 0, max: 250},
      {name: '填装', min: 0, max: 250}
    ],
    BB: [
      {name: '火力', min: 0, max: 125},
      {name: '雷装', min: 0, max: 525},
      {name: '耐久', min: 0, max: 2500},
      {name: '对空', min: 0, max: 250},
      {name: '回避', min: 0, max: 250},
      {name: '填装', min: 0, max: 250}
    ],
    AR: [
      {name: '火力', min: 0, max: 125},
      {name: '雷装', min: 0, max: 525},
      {name: '耐久', min: 0, max: 2500},
      {name: '对空', min: 0, max: 250},
      {name: '回避', min: 0, max: 250},
      {name: '填装', min: 0, max: 250}
    ],
    BBV: [
      {name: '火力', min: 0, max: 125},
      {name: '雷装', min: 0, max: 525},
      {name: '耐久', min: 0, max: 2500},
      {name: '对空', min: 0, max: 250},
      {name: '回避', min: 0, max: 250},
      {name: '填装', min: 0, max: 250}
    ],
    BC: [
      {name: '火力', min: 0, max: 125},
      {name: '雷装', min: 0, max: 525},
      {name: '耐久', min: 0, max: 2500},
      {name: '对空', min: 0, max: 250},
      {name: '回避', min: 0, max: 250},
      {name: '填装', min: 0, max: 250}
    ],
    CV: [
      {name: '火力', min: 0, max: 125},
      {name: '雷装', min: 0, max: 525},
      {name: '耐久', min: 0, max: 2500},
      {name: '对空', min: 0, max: 250},
      {name: '回避', min: 0, max: 250},
      {name: '填装', min: 0, max: 250}
    ],
    BM: [
      {name: '火力', min: 0, max: 125},
      {name: '雷装', min: 0, max: 525},
      {name: '耐久', min: 0, max: 2500},
      {name: '对空', min: 0, max: 250},
      {name: '回避', min: 0, max: 250},
      {name: '填装', min: 0, max: 250}
    ]
  };
  const indexMap = {
    DD: [0, 1, 2, 3, 4, 6],
    CL: [0, 1, 2, 3, 4, 6],
    CA: [0, 1, 2, 3, 4, 6],
    BB: [0, 1, 2, 3, 4, 6],
    AR: [0, 1, 2, 3, 4, 6],
    BBV: [0, 1, 2, 3, 4, 6],
    BC: [0, 1, 2, 3, 4, 6],
    CV: [0, 1, 2, 3, 4, 6],
    BM: [0, 1, 2, 3, 4, 6],
    CVL: [5, 2, 3, 4, 6]
  };

  export default {
    components: {},
    data() {
      return {
        code: '001',
        id: 379,
        form: {
          a: '',
          b: '',
          c: '',
          d: '',
          e: ''
        },
        info: {
          reform: false,
          white: false,
          white_name: '',
          white_zh: '',
          skin: 0,
          skins: [{name: '', zh: ''}, {name: '', zh: ''}, {name: '', zh: ''}],
          av: [0, 0, 0, 0, 0, 0, 0],
          avre: [0, 0, 0, 0, 0, 0, 0],
          oil: 0,
          speed: 0,
          speedre: 0,
          buildTime: '',
          getWay: ''
        },
        data: data,
        type: 'base',
        imgIndex: 0,
        imgsrc: ''
      };
    },
    watch: {},
    methods: {
      drawRadar() {
        if(!this.radar) {
          setTimeout(() => {this.drawRadar();}, 300);
          return;
        }
        this.radar.setOption(this.option);
      },
      switchImg(i, index) {
        this.imgIndex = index;
        this.type = i.type;
        this.imgsrc = this.List[index].link;
      },
      loadData() {
        $.get('resource/game/view', {id: this.id}, data => {
          this.form = data;
          var info = data.f && JSON.parse(data.f) || {};
          this.info.reform = info.reform || false;
          this.info.white = info.white || false;
          this.info.skin = info.skin || 0;
          this.info.white_name = info.white_name || '';
          this.info.white_zh = info.white_zh || '';
          this.info.buildTime = info.buildTime || '';
          this.info.getWay = info.getWay || '';
          this.info.oil = info.oil || 0;
          this.info.speed = info.speed || 0;
          this.info.speedre = info.speedre || 0;
          if(info.av && info.av.length === 7) this.info.av = info.av;
          if(info.avre && info.avre.length === 7) this.info.avre = info.avre;
          if(info.skins && info.skins.length >= 3) this.info.skins = info.skins;
          this.drawRadar();
        });
      },
      save() {
        this.form.f = JSON.stringify(this.info);
        this.form.uid = 1;
        this.form.token = '93b231ef890b8f9504609111ef81f936';
        $.get('resource/game/edit', this.form, data => {
          if(data == '1') {
            this.loadData();
            this.$msg('修改成功');
            history.back();
          }else if(data != '0') {
            this.$msg('修改失败');
            console.log(data);
          }
        });
      },
      back() {
        history.back();
      }
    },
    computed: {
      option() {
        var op = {
          tooltip: {},
          radar: {
            name: {color: '#333'},
            splitNumber: 5,
            axisLine: {
              lineStyle: {
                color: '#fdbc40',
                type: 'solid',
                opacity: .5
              }
            },
            splitLine: {
              lineStyle: {
                color: '#fdbc40',
                type: 'dashed',
                opacity: .8
              }
            },
            splitArea: {
              areaStyle: {
                color: 'rgba(253, 188, 64,.3)',
                opacity: 1
              }
            }
          },
          series: [{
            type: 'radar',
            animation: false,
            silent: true,
            data: [
              {
                symbolSize: 0,
                lineStyle: {
                  normal: {
                    width: 1,
                    color: '#fdbc40'
                  },
                  emphasis: {
                    color: '#fdbc40'
                  }
                }
              }
            ]
          }, {
            type: 'radar',
            data: [
              {
                symbolSize: 0,
                lineStyle: {
                  normal: {
                    width: 0
                  }
                },
                areaStyle: {
                  normal: {
                    shadowBlur: 13,
                    shadowColor: 'rgba(0,0,0,.2)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 5,
                    opacity: 1,
                    color: {
                      type: 'radial',
                      x: 0.5,
                      y: 0.5,
                      r: 0.5,
                      colorStops: [{
                        offset: 0, color: 'hsl(1,96%,85%)'
                      }, {
                        offset: 1, color: '#fc605d'
                      }]
                    }
                  }
                }
              }
            ]
          }]
        };
        op.radar.indicator = maxAv[this.form.b || 'DD'];
        op.series[0].data[0].value = maxAv[this.form.b || 'DD'].map(i => i.max);
        op.series[1].data[0].value = indexMap[this.form.b || 'DD'].map(i => this.info.av[i]);
        if(this.info.reform) {
          op.series[1].data.unshift({
            value: indexMap[this.form.b || 'DD'].map(i => this.info.avre[i]),
            symbolSize: 0,
            lineStyle: {
              normal: {
                width: 0
              }
            },
            areaStyle: {
              normal: {
                shadowBlur: 13,
                shadowColor: 'rgba(0,0,0,.2)',
                shadowOffsetX: 0,
                shadowOffsetY: 5,
                opacity: 1,
                color: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [{
                    offset: 0, color: 'hsl(129,59%,75%)'
                  }, {
                    offset: 1, color: '#34c849'
                  }]
                }
              }
            }
          });
        }
        return op;
      },
      Skin1: {
        set(i) {this.info.skin = i && 1 || 0;},
        get() {return this.info.skin > 0;}
      },
      Skin2: {
        set(i) {if(i && this.info.skin == 1) this.info.skin = 2; else this.info.skin = 1;},
        get() {return this.info.skin > 1;}
      },
      Skin3: {
        set(i) {if(i && this.info.skin == 2) this.info.skin = 3; else if(i) this.info.skin += 1; else this.info.skin = 2;},
        get() {return this.info.skin > 2;}
      },
      List() {
        var list = [{type: 'base', url: `/static/base/${this.code}.png`, link: `/static/base/${this.code}.jpg`}];
        if(this.info.reform) list.push({type: 'reform', url: `/static/reform/3${this.code}.png`, link: `/static/reform/${this.code}.jpg`});
        if(this.info.white) list.push({type: 'white', url: `/static/white/${this.code}.png`, link: `/static/white/${this.code}.jpg`});
        for(var i = 1; i <= this.info.skin; i++) {
          list.push({type: 'skin', url: `/static/skin/${this.code}-${i}.png`, link: `/static/skin/${this.code}-${i}.jpg`});
        }
        return list;
      }
    },
    mounted() {
      document.body.className = 'azurlane';
      if(this.$route.params.code.length === 5) {
        const id = parseInt(this.$route.params.code.split('sp')[1]);
        if(id > 0 && id <= 80) {
          this.id = id + 698;
        }
      }else {
        const id = parseInt(this.$route.params.code);
        if(id > 0 && id <= 320) {
          this.id = id + 378;
        }
      }
      this.code = this.$route.params.code;
      this.imgsrc = `/static/base/${this.code}.jpg`;
      this.loadData();
      this.$nextTick(() => {
        this.radar = echarts.init(this.$refs.radar);
      });
    },
    beforeDestroy() {}
  };
</script>

<style lang="scss">
  main.azurlane-view {
    font-size: .16rem;
    padding-top: 1px;
    .info-wrapper {
      overflow: hidden;
      background: rgba(255,255,255,.5);
      min-height: 400px;
      margin: 20px;
      padding: 20px;
      font-size: 14px;
      .info-content {
        overflow: hidden;
      }
      .drop {
        table {
          width: 100%;
          margin: 8px 0 16px;
          border: 1px solid #ebedf0;
          line-height: 1.5;
          font-size: .14rem;
          border-collapse: collapse;
          border-spacing: 0;
          empty-cells: show;
        }
        td,
        th {
          border: 1px solid #ccc;
          padding: 1em 1.5em;
          text-align: left;
        }
        th {
          white-space: nowrap;
          color: #678;
          font-weight: 500;
          background: #d9eaf1;
        }
        td {
          vertical-align: middle;
          background: rgba(255,255,255,.5);
        }
      }
      .radar {
        float: left;
        width: 285px;
        height: 330px;
      }
      p {
        text-align: left;
        margin-bottom: 1em;
      }
      .av {
        .item {
          width: 25%;
          margin: 0 1em 1em 0;
        }
      }
    }
    .illustrated-handbook {
      position: relative;
      float: left;
      margin: .2rem;
      background: rgba(255,255,255,.5);
      box-shadow: 1px 1px 6px rgba(0,0,0,.1);
      .content {
        width: 300px;
        height: 550px;
        margin: 13px 13px 13px 63px;
        > img {
          max-width: 300px;
          max-height: 550px;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,.2);
        }
      }
    }
    .tabs {
      position: absolute;
      top: 0; left: 0;
      width: 60px;
      padding-top: 5px;
      text-align: left;
      .thumbnail {
        display: inline-block;
        width: 100%;
        height: 430px;
        margin-top: 10px;
        overflow: hidden;
        .scroll-wrapper {
          position: relative;
          width: 90px;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          .bg {
            position: absolute;
            left: 0; top: 55px;
            display: block;
            width: 54px;
            height: 54px;
            margin: 3px;
            background: #409eff;
            border-radius: 5px;
            z-index: 0;
            transition: top .35s;
          }
        }
        .item {
          position: relative;
          display: block;
          width: 50px;
          height: 50px;
          margin: 5px;
          border: 1px solid #fff;
          background: #fff;
          border-radius: 4px;
          overflow-y: hidden;
          z-index: 5;
          > img {
            width: 50px;
            pointer-events: none;
          }
        }
      }
      .tab {
        display: inline-block;
        padding: 0 1em 0 .5em;
        margin: .5em 0 0;
        background: #fff;
        border-radius: 0 5px 5px 0;
        font-size: 12px;
        line-height: 2;
        cursor: pointer;
        transition: padding .35s, color .1s, background .35s linear;
        &.on {
          padding-left: 1em;
          background: #409eff;
          color: #fff;
        }
        &.disabled {
          background: #ccc;
          pointer-events: none;
        }
      }
    }
  }
</style>