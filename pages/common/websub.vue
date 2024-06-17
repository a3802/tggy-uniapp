<template>
	<web-view :src="url"></web-view>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  onLoad(item) {
	if(item.categoryId == 41964){
		this.url = 'https://tuiguang.yueyueyouqian.cn/#/?channel=i3ce';
	}else if(item.categoryId == 41965){
		this.url = 'http://fatecess.yueyueyouqian.cn';
	}
  }
}
</script>

<style>

</style>
