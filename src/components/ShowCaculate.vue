<template>
    <div class="haha">
        <div>原数据：</div>
        <ul>
            <li v-for="(item, key) in originList" :key="key">
                {{item.name}} - {{item.price}}元
            </li>
        </ul>
        <hr />
        <div>结果：</div>
        <ul>
            <li v-for="(item, key) in allTitle" :key="key">
                {{item}}元组合：{{returnData(item)}}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'ShowCaculate',
    data() {
        return {
            originList: [],
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
            console.log(countNames);
            return Object.keys(countNames);
        }
    },
    methods: {
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
        console.log(this.$route);
        this.originList = this.$route.query.list;
		this.getGroup(this.originList);
    }
}
</script>
<style lang="less" scoped>
.haha {
    ul {
        text-align: left;
        li {
            line-height: 20px;
        }
    }
}
</style>