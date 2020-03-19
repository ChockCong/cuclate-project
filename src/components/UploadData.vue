<template>
    <div class="whole-container">
        <div class="upload-set" v-if="!show">
            <div class="title-set">
                <label>请上传你的商品文件</label>
                <el-popover
                    placement="bottom"
                    trigger="click"
                    content="上传你准备好的excel文件，商品不要超过15个。请见谅！后续我们会对此再做优化">
                    <i class="el-icon-warning" slot="reference"></i>
                </el-popover>
            </div>
            <el-upload ref="upload"
            action="/"
            :show-file-list="false"
            :on-change="importExcel"
            :auto-upload="false">
                <el-button
                slot="trigger"
                icon="el-icon-upload"
                size="small"
                type="primary">
                {{originList.length ? '重新上传' : '上传文件'}}
                </el-button>
            </el-upload>
            <section v-if="originList.length">
                <section class="data-set">
                    <div>原数据：</div>
                    <ul>
                        <li v-for="(item, key) in originList" :key="key">
                            <span>{{`${item.name}  -  ${item.price}  元`}}</span>
                            <span class="cost-content">成本:{{item.cost}}元</span>
                        </li>
                    </ul>
                </section>
                <el-button class="caculate" icon="el-icon-check" @click="gtToShow">计算结果</el-button> 
            </section>
        </div>
        <ShowCaculate v-if="show" :show.sync="show" :originList="originList"></ShowCaculate>
    </div>
</template>
<script>
import XLSX from 'xlsx'
import ShowCaculate from './ShowCaculate';
export default {
    name: 'UploadData',
    components: {
        ShowCaculate
    },
    data() {
        return {
            xlsxJson: null,
            originList: [],
            show: false
        }
    },
    methods: {
        gtToShow() {
            this.show = true;
        },
        importExcel(file) {
            // let file = file.files[0] // 使用传统的input方法需要加上这一步
            const types = file.name.split('.')[1];
            const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
            if (!fileType) {
                this.$message('格式错误！请重新选择')
                return;
            }
            this.file2Xce(file).then(tabJson => {
                if (tabJson && tabJson.length > 0) {
                this.xlsxJson = tabJson;
                this.originList = [...this.xlsxJson[0].sheet.map(val => {
                    return {name: val['产品名'], price: val['价格'], cost: val['成本']}
                })]
                }
            })
        },
        file2Xce(file) {
            return new Promise(function(resolve) {
            const reader = new FileReader()
            reader.onload = function(e) {
            const data = e.target.result
            this.wb = XLSX.read(data, {
            type: 'binary'
            })
            const result = []
            this.wb.SheetNames.forEach((sheetName) => {
            result.push({
            sheetName: sheetName,
            sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            })
            })
            resolve(result)
            }
            reader.readAsBinaryString(file.raw)
            // reader.readAsBinaryString(file) // 传统input方法
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.whole-container {
    padding: 5px 0 0 0;
    overflow-y: scroll;
    height: calc(100vh - 30px);
    & .upload-set {
        width: 100%;
        /deep/ .el-button {
            width: 200px;
            height: 50px;
            font-size: 18px;
        }
        & .title-set {
            padding: 10px 0;
            font-size: 16px;
            & label {
                margin-right: 10px;
            }
        }
        & .data-set {
            border:#409EFF 2px dashed;
            border-radius: 5px;
            margin: 20px 0;
            padding: 10px 0;
            font-weight: bold;
        }
        & ul {
            text-align: left;
            li {
                line-height: 20px;
            }
        }
        .caculate {
            background: black;
            color: white;
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
}
</style>