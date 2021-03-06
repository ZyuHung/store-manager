<template>
    <u-modal :visible="visible" :title="type ? '新增预定' : '编辑预定'" @before-close="submit" @close="closeModal" class="arrange-info-modal">
        <el-form ref="form" :inline="true" :model="form" label-width="110px">
            <el-divider content-position="left">Step1: 安排信息</el-divider>
            <el-form-item label="所属门店" :rules="{ required: true }">
                <el-select v-model="form.storeId" filterable disabled size="mini">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预定主题" :rules="{ required: true }">
                <el-select v-model="form.themeId" filterable placeholder="请选择预定主题" disabled size="mini">
                    <el-option v-for="item in otherList['themeList']" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接待人员" :rules="{ required: true }">
                <el-select v-model="form.receiverAccount" :disabled="hasEnded" filterable placeholder="请选择接待人员" size="mini">
                    <el-option v-for="item in otherList['staffList']" :key="item.account" :label="item.nickName" :value="item.account"> </el-option>
                </el-select>
            </el-form-item>
            <el-divider content-position="left">Step2: 客户信息</el-divider>
            <el-form-item label="客户来源" :rules="{ required: true }">
                <el-select v-model="form.sourceType" :disabled="hasEnded" placeholder="请选择客户来源" size="mini">
                    <el-option-group v-show="group.children.length" v-for="group in sourceTypeOptions" :key="group.label" :label="group.label">
                        <el-option v-for="item in group.children" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-option-group>
                </el-select>
            </el-form-item>
            <el-form-item label="预约电话" :rules="{ required: true }">
                <u-input
                    v-model="form.phone"
                    :regex="/^[0-9\u4e00-\u9fa5]+$/g"
                    maxLength="11"
                    :disabled="hasStarted || hasEnded"
                    placeholder="请输入预约电话"
                    size="mini"
                />
            </el-form-item>
            <el-form-item label="预定时间" :rules="{ required: true }">
                <el-select v-model="form.arrangeTime" filterable placeholder="请选择预定时间" :disabled="hasStarted" size="mini">
                    <el-option v-for="(item, index) in list" :key="item + index" :label="item | dateFormat('yyyy-MM-dd hh:mm:ss')" :value="item"> </el-option>
                </el-select>
                <span class="arrange-time-tip">({{ form.hour }}点附近的预约时间)</span>
            </el-form-item>
            <br />
            <el-divider content-position="left">Step3: 支付信息</el-divider>
            <el-form-item label="消费明细" vtop>
                <PaymentInfoCard
                    v-model="form.paymentList"
                    :disabled="hasEnded"
                    :amountTemp.sync="form.amountTemp"
                    :cardId.sync="form.cardId"
                    :cardConsumption.sync="form.cardConsumption"
                    :cardPeopleNum.sync="form.cardPeopleNum"
                    :discount="form.discount"
                    :list="otherList['paymentList']"
                ></PaymentInfoCard>
                <div class="extra-discount">
                    <el-checkbox v-model="form.hasDiscount">特殊优惠</el-checkbox>

                    <u-input v-show="form.hasDiscount" v-model.number="form.discount" maxLength="11" placeholder="请输入特殊优惠（元）" size="mini" />
                </div>

                <span class="sum-tip">总计：{{ form.amount }} 元</span>
            </el-form-item>
            <br />
            <div v-if="!hasStarted" class="before-started-info-wrapper">
                <el-form-item label="是否付款">
                    <el-switch v-model="form.isPaid" :disabled="hasEnded"></el-switch>
                </el-form-item>
                <el-form-item label="是否到店">
                    <el-switch v-model="form.isArrived" :disabled="hasEnded"></el-switch>
                </el-form-item>
                <br />
                <el-divider content-position="left">Step4: 其它信息</el-divider>
                <el-form-item label="钥匙编号">
                    <el-select v-model="form.keyId" :disabled="hasEnded" filterable placeholder="请选择钥匙编号" size="mini">
                        <el-option v-for="item in otherList['keyList']" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="押金">
                    <u-input v-model.number="form.deposit" :disabled="hasEnded" placeholder="请输入押金" />
                </el-form-item>
            </div>
            <br />
            <el-form-item label="备注">
                <u-input v-model="form.remark" :disabled="hasEnded" placeholder="请输入备注" type="textarea"> </u-input>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import PaymentInfoCard from '@/components/order/payment-info-card'
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addReserve, editReserve, getArrangeTime } from '@/server/api'
import { MODIFY_MODAL_TYPE, ARRANGE_STATUS_MAP } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

export default {
    components: { PaymentInfoCard },
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false },
        otherList: { type: Object, default: () => {} }
    },
    data() {
        return {
            type: MODIFY_MODAL_TYPE.ADD,

            form: {
                id: '',
                themeId: '',
                paymentList: {},
                amount: 0,
                date: 0,
                cardId: null,
                discount: null,
                cardConsumption: null,

                // 以下是额外字段：
                hasDiscount: false,
                amountTemp: null
            },
            searchParams: {},
            num: 0,

            list: [],
            ARRANGE_STATUS_MAP
        }
    },
    computed: {
        sourceTypeOptions() {
            let onlineGroup = {
                label: '线上',
                children: []
            }
            let offGroup = {
                label: '线下',
                children: []
            }

            let list = this.otherList['sourceList']
            list &&
                list.forEach(item => {
                    let option = { value: item.id, label: item.name }

                    if (item.sourceType === 2) {
                        offGroup.children.push(option)
                    } else {
                        onlineGroup.children.push(option)
                    }
                })
            return [onlineGroup, offGroup] || []
        },
        hasStarted() {
            return this.form.status === ARRANGE_STATUS_MAP.STARTED
        },
        hasEnded() {
            return this.form.status === ARRANGE_STATUS_MAP.END
        },
        maxSessionCount() {
            return this.otherList['themeList']
        },
        ...mapGetters(['getStoreListStore'])
    },
    watch: {
        'form.discount'(val) {
            let amount = this.form.amountTemp - val || 0
            this.form.amount = Number(amount.toFixed(2))
        },
        'form.amountTemp'(val) {
            let amount = val - this.form.discount || 0
            this.form.amount = Number(amount.toFixed(2))
        },
        'form.hasDiscount'() {
            this.form.discount = null
            this.$set(this.form, 'discount', null)
        }
    },
    created() {
        this.$bus.$on('open-arrange-info-modal', (arrangeDetail, isAdd) => {
            this.type = isAdd
            const { id: orderId, date, themeId, hour, storeId, amount } = arrangeDetail
            let editFormExtra = { discount: null, amountTemp: amount || 0, hasDiscount: !!arrangeDetail.discount }
            this.form = this.type ? { ...arrangeDetail, ...editFormExtra } : { ...this.form, ...arrangeDetail, ...editFormExtra }
            this.searchParams = { orderId, date, themeId, hour, storeId }
            this._getArrangeTime()
        })
    },
    destroyed() {
        this.$bus.$off('open-arrange-info-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this.type ? this._addReserve() : this._editReserve()
        },

        _addReserve() {
            if (typeof this.form.arrangeTime !== 'number') {
                this.form.arrangeTime = this.form.arrangeTime.getTime()
            }
            let param = { ...this.form }
            addReserve(param).then(() => {
                this.$message('新增成功')
                this.closeModal(true)
            })
        },

        _editReserve() {
            let param = { ...this.form }
            editReserve(param).then(() => {
                this.$message('修改成功')
                this.closeModal(true)
            })
        },

        _getArrangeTime() {
            getArrangeTime(this.searchParams).then(data => (this.list = [...data.list] || []))
        }
    }
}
</script>

<style lang="scss" scoped>
.arrange-info-modal {
    /deep/ .u-modal-body {
        margin: 20px 25px;
        overflow-y: scroll;

        .el-form {
            width: 900px;

            .el-form-item {
                margin-bottom: 4px;

                &[vtop] {
                    .el-form-item__label {
                        line-height: 1;
                    }
                }
            }

            .payment-wrapper {
                width: 500px;

                td {
                    line-height: 24px;
                }
            }

            .arrange-time-wrapper {
                width: 303px;

                .arrange-time {
                    width: 193px;
                }
            }

            .extra-discount {
                text-align: right;
            }

            .arrange-time-tip,
            .sum-tip {
                float: right;
                @include font-normal(12px, $normal-color-s);
            }

            .arrange-time-tip {
                position: absolute;
                top: 25px;
                left: 0;
            }

            .sum-tip {
                @include font-normal(12px, $primary-color);
            }

            .u-input {
                width: 172px;
                height: 28px;
            }

            .textarea {
                width: 506px;
                height: 130px;
            }
        }

        .u-error {
            position: absolute;
            bottom: -15px;
            font-size: 12px;
        }

        .el-divider {
            margin: 14px 0;

            .el-divider__text {
                @include font-normal(12px, $primary-color);
            }
        }
    }
}
</style>
