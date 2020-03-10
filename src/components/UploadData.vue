<template>
    <div class="xixi">
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
            上传文件
            </el-button>
        </el-upload>
        <section class="data-set" v-if="originList.length">
            <div>原数据：</div>
            <ul>
                <li v-for="(item, key) in originList" :key="key">
                    {{item.name}} - {{item.price}}元
                </li>
            </ul>
            <el-button @click="gtToShow">计算结果</el-button> 
        </section>
    </div>
</template>
<script>
import XLSX from 'xlsx'
export default {
    name: 'UploadData',
    data() {
        return {
            xlsxJson: null,
            originList: []
        }
    },
    methods: {
        gtToShow() {
            this.$router.push(
                {
                    path: '/show',
                    query: {
                        list: this.originList
                    }
                }
            )
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
                    return {name: val['产品名'], price: val['价格']}
                })]
                console.log('数据', this.originList);
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
<style lang="less" scoped>
.xixi {
    .data-set {
        border:#409EFF 1px dashed;
        margin: 20px 0;
        padding: 10px 0;
    }
    ul {
        text-align: left;
        li {
            line-height: 20px;
        }
    }
}
</style>