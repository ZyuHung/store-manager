<template>
    <u-modal :visible="visible" :title="type ? '新增仓库' : '编辑仓库'" @before-close="submit" @close="closeModal" class="m-house-info-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item v-if="!type" label="仓库ID">
                <u-label :text="form.id" />
            </el-form-item>
            <el-form-item label="仓库名称">
                <u-input v-model="form.name" placeholder="请输入仓库名称"> </u-input>
            </el-form-item>
            <el-form-item label="地址">
                <u-input v-model="form.address" placeholder="请输入仓库地址"> </u-input>
            </el-form-item>
            <el-form-item label="所属门店">
                <el-select v-model="form.storeId" filterable placeholder="请选择所属门店">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="使用状态">
                <el-radio v-model="form.status" :label="true">启用</el-radio>
                <el-radio v-model="form.status" :label="false">禁用</el-radio>
            </el-form-item>
            <el-form-item label="备注">
                <u-input v-model="form.remark" placeholder="请输入备注" type="textarea"> </u-input>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addMaterialHouse, editMaterialHouse } from '@/server/api'
import { MODIFY_MODAL_TYPE } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

export default {
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
            type: MODIFY_MODAL_TYPE.ADD,

            form: {
                status: true
            }
        }
    },
    computed: {
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-material-house-info-modal', (houseDetail, isAdd) => {
            this.type = isAdd
            this.form = { ...houseDetail }
        })
    },
    destroyed() {
        this.$bus.$off('open-material-house-info-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this.type ? this._addMaterialHouse() : this._editMaterialHouse()
        },
        _addMaterialHouse() {
            let param = { ...this.form }
            addMaterialHouse(param).then(() => {
                this.$message('新增成功')
                this.closeModal(true)
            })
        },
        _editMaterialHouse() {
            let param = { ...this.form }
            editMaterialHouse(param).then(() => {
                this.$message('修改成功')
                this.closeModal(true)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.m-house-info-modal {
    /deep/ .u-modal-body {
        overflow-y: visible;

        .el-form {
            width: 468px;

            .record-type-wrapper {
                .el-select {
                    width: 80px;
                    margin-right: 10px;
                }
                .u-input {
                    width: 230px;
                }
            }

            .textarea {
                height: 130px;
            }
        }

        .u-error {
            position: absolute;
            bottom: -15px;
            font-size: 12px;
        }
    }
}
</style>
