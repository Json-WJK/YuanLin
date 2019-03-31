<template>
    <text class="wack" :class="['wack-' + type ]" :style="{ 'font-size': size + 'rpx' || '16rpx', color: color }"></text>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: ''
            },
            size: {
                type: [String, Number],
                default: ''
            },
            color: {
                type: String,
                default: ''
            }
        },
        mounted() {
        },
    }

</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
    @font-face {
        font-family: "wack";
        src: url('//at.alicdn.com/t/font_1023853_7g7rutihyyy.ttf?t=1554042982264') format('truetype');
    }

    .wack {
        font-family:"wack" !important;
        font-size:16px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
.wack-nv:before {
  content: '\e66b';
}

.wack-qianming:before {
  content: '\e6da';
}

.wack-nan-copy:before {
  content: '\e600';
}

.wack-shijianzhou32:before {
  content: '\e746';
}
.wack-share:before {
  content: "\e747"
}
.wack-liaotian:before {
  content: "\e672";
}
.wack-fenxiang:before {
  content: "\e670";
}
.wack-dianzan:before {
  content: "\e66e";
}
.wack-xiala-copy:before {
  content: "\e601";
}
.wack-xinfeng:before {
  content: "\e6d3";
}


</style>

