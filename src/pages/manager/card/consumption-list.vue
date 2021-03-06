<template>
    <u-layout class="consumption-list" direction="v">
        <div class="top-wrapper">
            <u-layout>
                <el-date-picker v-model="rangeTime" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期" />
                <u-input v-model.number="searchParams.cardId" maxLength="100" placeholder="请输入卡号" searchIcon @key-press-enter="_getList(true)" />
            </u-layout>
            <u-layout class="operation">
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <el-button v-if="searchParams.cardId" type="primary" icon="el-icon-plus" circle @click="addPatch"></el-button>
                </el-tooltip>
            </u-layout>
        </div>

        <u-layout class="content-wrapper" direction="v">
            <u-table ref="operationTable" :list="consumeList" auto is-list>
                <template slot-scope="{ row }">
                    <u-table-column width="10vw" label="流水ID" ellipse>{{ row.id || '-' }}</u-table-column>
                    <u-table-column width="10vw" label="充值方式" ellipse>{{ _findRechargeTxt(row.rechargeWay) || '-' }}</u-table-column>
                    <u-table-column width="10vw" label="流水描述" ellipse>{{ row.flowDesc }}</u-table-column>
                    <u-table-column width="10vw" label="消费/充值金额" ellipse>{{ row.amount }}</u-table-column>
                    <u-table-column width="10vw" label="余额" ellipse> {{ row.balance }} </u-table-column>
                    <u-table-column width="10vw" label="操作门店" ellipse> {{ row.storeName }} </u-table-column>
                    <u-table-column width="14vw" label="消费时间">
                        {{ row.flowTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}
                    </u-table-column>
                    <u-table-column label="操作">
                        <u-layout direction="h">
                            <i class="icon el-icon-edit" @click="editRow(row)"></i> <i class="icon el-icon-delete" @click="deleteRow(row)"></i>
                        </u-layout>
                    </u-table-column>
                </template>
            </u-table>

            <el-pagination
                v-show="consumeList.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchParams.currentPage"
                :page-sizes="[10, 50, 100]"
                :page-size="searchParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchParams.totalCount"
            >
            </el-pagination>
        </u-layout>

        <UConsumeModal :visible="isOpenConsumeModal" @close="closeConsumeModal" />
    </u-layout>
</template>

<script>
import UConsumeModal from '@/components/user/consume-modal'
import { getConsumeList, deleteConsume } from '@/server/api'
import { RECHARGE_TYPE_MAP, MODIFY_MODAL_TYPE } from '@/utils/config'

export default {
    name: 'consumption-list',
    components: { UConsumeModal },
    data() {
        return {
            searchParams: {
                cardId: '',
                currentPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            rangeTime: [],

            consumeList: [],

            isOpenConsumeModal: false
        }
    },
    watch: {
        'searchParams.userType'() {
            this._getList(false)
        },
        'searchParams.currentPage'() {
            this._getList(false)
        },
        'searchParams.pageSize'() {
            this._getList(true)
        },
        rangeTime(val) {
            if (!val) {
                delete this.searchParams.startTime
                delete this.searchParams.endTime
            } else {
                let [startTime, endTime] = val
                this.searchParams.startTime = startTime.getTime()
                this.searchParams.endTime = endTime.getTime() + 86399000
            }
            this._getList(true)
        }
    },
    created() {
        this.searchParams.cardId = this.$route.params.cardId
        this._getList(true)
    },
    methods: {
        addPatch() {
            let param = { cardId: this.searchParams.cardId }
            this.$bus.$emit('open-consume-modal', param, MODIFY_MODAL_TYPE.ADD)
            this.isOpenConsumeModal = true
        },
        editRow(row) {
            console.log(row)
            this.isOpenConsumeModal = true
            this.$bus.$emit('open-consume-modal', row, MODIFY_MODAL_TYPE.EDIT)
        },
        deleteRow(row) {
            this.$confirm(`是否删除ID为 ${row.id} 的流水记录？`).then(() =>
                deleteConsume(row).then(() => {
                    this.$message('流水记录删除成功')
                    this._getList(true)
                })
            )
        },
        _getList(isNew) {
            if (!this.searchParams.cardId) return
            isNew && (this.searchParams.currentPage = 1)

            getConsumeList(this.searchParams).then(data => {
                this.consumeList = data.list || []
                this.searchParams.totalCount = data.totalCount || 0
            })
        },
        // pageSize大小
        handleSizeChange(val) {
            this.searchParams.pageSize = val
        },
        // currentPage翻页
        handleCurrentChange(val) {
            this.searchParams.currentPage = val
        },
        closeConsumeModal() {
            this.isOpenConsumeModal = false
            this._getList(false)
        },
        _findRechargeTxt(type) {
            if (typeof type !== 'number') return '-'
            return RECHARGE_TYPE_MAP.find(item => type === item.value).label
        }
    }
}
</script>

<style lang="scss" scoped>
.consumption-list {
    height: 100%;
    padding: 0 30px 40px;

    .top-wrapper {
        display: flex;
        height: 40px;
        justify-content: space-between;
        align-items: center;

        /deep/ .el-range-separator {
            padding: 0;
        }

        .el-button {
            margin-right: 0;
        }
    }

    .content-wrapper {
        .icon {
            font-size: 20px;
            cursor: pointer;
        }

        .el-pagination {
            text-align: right;
        }
    }
}
</style>
