<template>
  <div class="home">
    <el-card class="box-card"
             v-for="card in cardList"
             :key="card.id">
      <h1 class="card-title">{{card.title}}</h1>
      <div class="card-rate">{{card.val}}</div>
      <!-- <img :src="card.imgUrl"
           alt="rate图片"
           class="card-img"> -->
      <el-divider></el-divider>
      <div class="card-footer">
        <span class="pr-10" :class="[isRateType(card.monthRate) ? '' : 'regularText-color']">
          {{card.footerLeftText}}
          <el-icon v-if="isRateType(card.monthRate)"
                   class="card-footer-icon"
                   color="rgb(147,219,111)">
            <caret-top />
          </el-icon>
          <span class="regularText-color">{{card.monthRate}}</span>
        </span>
        <span v-if="card.footerRightText">
          {{card.footerRightText}}
          <el-icon class="card-footer-icon"
                   color="rgb(255,35,46)">
            <caret-bottom />
          </el-icon>
          <span class="regularText-color">{{card.yearRate}}</span>
        </span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const cardList = [
  { title: '档口总入驻率', val: '78%', imgUrl: '', monthRate: '12%', yearRate: '11%', id: '1', footerLeftText: '月同比', footerRightText: '年环比' }
  // { title: '档口总入驻率', val: '78%', imgUrl: '', monthRate: '12%', yearRate: '11%', id: '2', footerLeftText: '月同比', footerRightText: '年环比' },
  // { title: '档口总入驻率', val: '78%', imgUrl: '', monthRate: '12%', yearRate: '11%', id: '3', footerLeftText: '月同比', footerRightText: '年环比' },
  // { title: '档口总入驻率', val: '78%', imgUrl: '', monthRate: '12423', yearRate: '11%', id: '4', footerLeftText: '七日访问量' },
  // { title: '档口总入驻率', val: '78%', imgUrl: '', monthRate: '223', yearRate: '11%', id: '5', footerLeftText: '30天保修单数量' }
]
function isRateType (val) {
  return val && val.indexOf('%') !== -1
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-wrap: wrap;
  .box-card {
    flex: 0 0 20%;
    min-width: 200px;
    margin: 0px 20px 20px 0;
    text-align: left;
    .card-title {
      margin-top: 0;
      font-size: var(--el-font-size-base);
      color: var(--el-text-color-secondary);
      font-weight: 400;
    }
    .card-rate {
      color: var(--el-color-black);
      font-size: 30px;
      font-weight: var(--el-font-weight-primary);
    }
    .card-img {
      padding-top: 20px;
    }
    .el-divider--horizontal {
      margin: 20px 0;
    }
    .card-footer {
      display: flex;
      font-size: var(--el-font-size-base);
      color: var(--el-text-color-secondary);
      font-weight: 400;
      .card-footer-icon {
        margin: 0 5px;
      }
    }
  }
  .regularText-color {
    color: var(--el-text-color-regular);
  }
}
</style>
