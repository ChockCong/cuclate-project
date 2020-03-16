<template>
    <div class="show-set">
        <div>原数据：</div>
        <ul>
            <li v-for="(item, key) in originList" :key="key">
                {{item.name}} - {{item.price}}元
            </li>
        </ul>
        <hr />
        <div>结果：</div>
        <template v-for="(item, key) in allTitle">
            <div class="sub-title" :key="key" @click="showData(item)">
                <span>{{item.idx}}元组合</span>
                <i class="el-icon-circle-plus-outline"></i>
            </div>
            <div v-if="item.show" :key="key">
                {{returnData(item.idx)}}
            </div>
        </template>
    </div>
</template>
<script>
export default {
    name: 'ShowCaculate',
    props: ['originList'],
    data() {
        return {
            resultList:[]
        };
    },
    computed: {
        allTitle() {
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
            return last;
        }
    },
    methods: {
        showData (item) {
            item.show = !item.show;
        },
        returnData(price) {
            let str = '[';
            this.resultList.forEach((val) => {
                if (val.price === Number(price)) {
                    str = str + val.name + ',';
                }
            });
            
            str += ']';
            return str;
        },
        getGroup(data, index = 0, group = []) {
			let need_apply = new Array();
			need_apply.push(data[index]);
			for (let i = 0; i < group.length; i++) {
				need_apply.push({ name: `${group[i].name}+${data[index].name}`, price: group[i].price + data[index].price });
            }
            group.push.apply(group, need_apply);
			if (index + 1 >= data.length) {
                this.resultList = group;
                return group;
            }
			else return this.getGroup(data, index + 1, group);
		},
    },
    beforeMount () {
		this.getGroup(this.originList);
    }
}
</script>
<style lang="less" scoped>
.show-set {
    & .sub-title{
        width: 100%;
        height: 35px;
        background-color: #409EFF;
        color: white;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 5px;
        & span {
            font-weight: bold;
            margin-right: 10px;
        }
    }
    ul {
        text-align: left;
        li {
            line-height: 20px;
        }
    }
}
</style>