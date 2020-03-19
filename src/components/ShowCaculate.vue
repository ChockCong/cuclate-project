<template>
    <div class="show-set" ref="container">
        <div class="back">
            <el-button @click="back" type="warning" icon="el-icon-arrow-left">返回</el-button>
        </div>
        <div>原数据：</div>
        <ul>
            <li v-for="(item, key) in newList" :key="key">
                <span>{{`${item.name}  -  `}}</span>
                <el-input size="mini" v-model="item.price" @change="formatInput($event, key)"></el-input>
                <span> 元</span>
                <span class="cost-content">成本:{{item.cost}}元</span>
            </li>
        </ul>
        <el-button class="caculate" icon="el-icon-check" @click="caculateAgain">重新计算</el-button> 
        <hr />
        <div>结果：</div>
        <template v-for="(item, key) in allTitle">
            <div :key="key">
                <div class="sub-title" @click="showData(item, key)">
                    <span>{{item.idx}}元组合</span>
                    <i class="el-icon-circle-plus-outline"></i>
                </div>
                <div v-if="item.show">
                    <template v-for="(value, index) in returnData(item.idx)">
                        <p :key="index">
                            <span>{{value.name}}</span>
                            <span class="cost-content">成本:{{value.cost}}元</span>
                        </p>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    name: 'ShowCaculate',
    props: ['show','originList'],
    data() {
        return {
            resultList:[],
            newList: [],
            allTitle: []
        };
    },
    computed: {
        
    },
    methods: {
        back() {
            this.$emit('update:show', false);
        },
        allTitleSum() {
            const countNames = this.resultList.reduce((allPrice, value) => {
                if (value.price in allPrice) {
                    allPrice[value.price] ++;
                }
                else {
                    allPrice[value.price] = 1;
                }
                return allPrice;
            }, {});
            let last = [...Object.keys(countNames)];
            last = last.map(val => {
                let newSet = {}
                newSet.idx = val;
                newSet.show = false;
                return newSet;
            })
            this.allTitle = last;
            return last;
        },
        formatInput(e, key) {
            this.newList.forEach((value, index) => {
                if (index === key) {
                    value.price = Number(e);
                }
            })
        },
        showData (item) {
            item.show = !item.show;
            this.$nextTick(() => {
                this.$forceUpdate();
            });
        },
        returnData(price) {
            let arr = [];
            arr = this.resultList.filter(val => {
                return val.price === Number(price);
            });
            return arr;
        },
        caculateAgain() {
            this.resultList = [];
            this.$nextTick(() => {
                this.getGroup(this.newList);
            })
        },
        getGroup(data, index = 0, group = []) {
			let need_apply = new Array();
			need_apply.push(data[index]);
			for (let i = 0; i < group.length; i++) {
				need_apply.push({ name: `${group[i].name}+${data[index].name}`, price: group[i].price + data[index].price, cost: group[i].cost + data[index].cost });
            }
            group.push.apply(group, need_apply);
            if (need_apply[need_apply.length - 1].price >= 300) {
                this.resultList = group;
                this.allTitleSum();
                return group;
            }
			if (index + 1 >= data.length) {
                this.resultList = group;
                this.allTitleSum();
                return group;
            }
			else return this.getGroup(data, index + 1, group);
		},
    },
    beforeMount () {
        this.newList = [...this.originList];
		this.getGroup(this.originList);
    }
}
</script>
<style lang="less" scoped>
.show-set {
    & .back {
        padding: 10px;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
    }
    & .sub-title{
        // width: 100%;
        height: 35px;
        background-color: #409EFF;
        color: white;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
        padding: 0 5px;
        & span {
            font-weight: bold;
            margin-right: 10px;
        }
    }
    & .cost-content {
            margin-left: 10px;
            font-size: 14px;
            color: white;
            font-weight: bold;
            background-color: darkred;
            padding: 0 3px;
    }
    ul {
        font-weight: bold;
        text-align: left;
        li {
            line-height: 20px;
            padding: 5px 0;
            /deep/ .el-input {
                width: 100px;
            }
        }
    }
    .caculate {
        background: black;
        color: white;
    }
}
</style>