<template>
  <div class="draw-arrow" ref="drawEle">
    <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker
          class="path"
          id="markerArrow"
          markerWidth="12"
          markerHeight="12"
          refX="6"
          refY="6"
          orient="auto">
          <path d="M2,4 L5,6 L2,8 L9,6 L2,4" fill="red" class="arrow" />
        </marker>
      </defs>
      <g
        v-for="(line, index) in relation.filter(item => item.source.key && item.target.key)"
        :key="index"
        :class="['path-end', {
          active: currentRelation.source && currentRelation.source.key === line.source.key && currentRelation.target && currentRelation.target.key === line.target.key
        }]"
        @click="removeRelation(line.target)"
      >
        <path
          class="line"
          :d="`M${line.source.x}, ${line.source.y} L${line.target.x}, ${line.target.y}`"
          marker-end="url(#markerArrow)"
        />
        <image
          class="icon-remove"
          :x="(line.source.x + line.target.x) / 2 - 6"
          :y="(line.source.y + line.target.y) / 2  - 6"
          width="12"
          height="12"
          xlink:href="data:image/png;base64,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" />
      </g>
      <g v-if="drawing">
        <path
          class="line"
          :d="`M${startX}, ${startY} L${endX}, ${endY}`"
          stroke-dasharray="5,5"
          marker-end="url(#markerArrow)"
        />
      </g>
    </svg>
  </div>
</template>

<script>
  import { getOffset, deepCopy } from '../utils.js';
  export default {
    name: 'draw-arrow',
    props: {
      sourceData: {
        type: Array,
        default: () => {
          return [];
        }
      },
      targetData: {
        type: Array,
        default: () => {
          return [];
        }
      },
      relation: {
        type: Array,
        default: () => {
          return [];
        }
      },
      currentRelation: {
        type: Object,
        default: () => {
          return {};
        }
      },
    },
    data() {
      return {
        drawEle: null,
        baseXY: {
          left: 0,
          top: 0,
        },
        drawing: false,
        endX: 0,
        endY: 0,
        sourceTarget: {},
        startX: 0,
        startY: 0,
      }
    },
    watch: {
      // watch drawing and emit
      drawing(val) {
        this.$emit('changeDrawing', val);
      },
      // watch sourceTarget and emit
      sourceTarget(val) {
        this.$emit('changeSourceTarget', val);
      },
    },
    mounted () {
      this.drawEle = this.$refs.drawEle;
      this.$nextTick(() => {
        this.addEvent()
      })
    },
    methods: {
      removeRelation (target) {
        const relation = deepCopy(this.relation).filter((o) => {
          return o.target.key !== target.key;
        });
        this.$emit('changeRelation', relation);
      },
      setDefaultState() {
        this.drawing = false;
        this.endX = 0;
        this.endY = 0;
        this.sourceTarget = {};
        this.startX = 0;
        this.startY = 0;
      },
      domOperate(eventDom) {
        const offset = getOffset(eventDom)
        return {
          key: eventDom.offsetParent.getAttribute('data-key'),
          left: offset.left - this.baseXY.left + 6,
          top: offset.top - this.baseXY.top + 6
        };
      },
      addEvent() {
        this.baseXY = getOffset(this.drawEle);
        const box = document.querySelector('.field-mapping');
        let scrollTop = 0;
        let scrollLeft = 0;
        let sourceDom = null;
        document.documentElement.onmousedown = (event) => {
          const eventDom = event.target;
          sourceDom = eventDom;
          const className = eventDom && eventDom.className || '';
          if (className && typeof className === "string" && className.indexOf("source-row-icon") > -1) {
            event.preventDefault();
            const domOperateObj = this.domOperate(eventDom);
            const relation = deepCopy(this.relation);
            if (relation.find((o) => {
              return o.source.key === domOperateObj.key;
            })) {
              return;
            }
            if (this.baseXY !== getOffset(this.drawEle)) {
              this.baseXY = getOffset(this.drawEle);
            }
            let scrollEle = box;
            document.body.classList.add("user-select-none");
            this.sourceTarget = this.sourceData.find((o) => o.key === domOperateObj.key) || {};
            // this.props.changeIconStatus(sourceData);
            this.startX = domOperateObj.left;
            this.startY = domOperateObj.top;
            this.endX = domOperateObj.left;
            this.endY = domOperateObj.top;
            this.drawing = true;
            while (scrollEle.tagName !== 'BODY') {
              scrollTop += scrollEle.scrollTop;
              scrollLeft += scrollEle.scrollLeft;
              scrollEle = scrollEle.parentElement;
            }
          }
        };
        document.documentElement.onmousemove = (event) => {
          if (this.drawing) {
            this.endX = event.pageX - this.baseXY.left + scrollLeft,
            this.endY = event.pageY - this.baseXY.top + scrollTop
          }
        };
        document.documentElement.onmouseup = (event) => {
          document.body.classList.remove("user-select-none");
          const { startX, startY, sourceTarget } = this;
          const eventDom = event.target;
          const className = eventDom && eventDom.className || '';
          if (className && typeof className === "string" && className.indexOf("target-row-icon") > -1) {
            const domOperateObj = this.domOperate(eventDom);
            const relation = deepCopy(this.relation);
            if (relation.find((o) => {// target不允许映射多次
              return o.target.key === domOperateObj.key;
            }) || relation.find((o) => { // 过滤连线已存在的情况
              return o.target.key === domOperateObj.key && o.source.key === this.domOperate(sourceDom).key;
            })) {
              // this.props.changeIconStatus();
              this.setDefaultState();
              sourceDom = null;
              return;
            }
            const targetData = this.targetData.find((o) => {
              return o.key === domOperateObj.key;
            });
            relation.push({
              source: {
                x: startX,
                y: startY,
                ...sourceTarget
              },
              target: {
                x: domOperateObj.left,
                y: domOperateObj.top,
                ...targetData
              }
            });
            this.$emit('changeRelation', relation);
            sourceDom = null;
          }
          // this.props.changeIconStatus();
          this.setDefaultState();
          scrollTop = 0;
          scrollLeft = 0;
        };
      }
    }
  }
</script>

<style lang="scss" scoped>
.draw-arrow {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  .path-end {
    cursor: pointer;

    .line {
      stroke: #33B5D4;
      fill: none;
      stroke-width: 2px;
    }
    .icon-remove {
      opacity: 0;
    }

    &:hover, &.active {
      .line {
        stroke: #00A2CA;
        stroke-width: 3px;
      }
      .icon-remove {
        opacity: 1;
      }
    }
  }

  .path {
    fill: #33B5D4;

    .arrow {
      fill: #00A2CA;
    }
  }

  .line {
    stroke: #33B5D4;
    fill: none;
    stroke-width: 2px;
  }
}
</style>