<template>
    <nav class="u-sign-up">
        <el-card class="sign-up-wrapper">
            <div slot="header" class="clearfix">
                <span>用户注册</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toggleBox">去登录</el-button>
            </div>
            <div class="content">
                <el-form ref="form" :model="form">
                    <el-form-item>
                        <u-input v-model="form.account" placeholder="请输入用户名" />
                        <u-error :visible="!$v.form.account.required" text="请输入用户名" />
                        <u-error :visible="!$v.form.account.checkFormat" text="支持长度为2~15的英文、中文、下划线，不能包含空格" />
                    </el-form-item>
                    <el-form-item>
                        <u-input v-model="form.password" placeholder="请输入密码" />
                        <u-error :visible="!$v.form.password.required" text="请输入密码" />
                    </el-form-item>
                    <el-form-item>
                        <u-input v-model="form.passwordConfirm" placeholder="请再次输入密码" lazy />
                        <u-error :visible="!$v.form.passwordConfirm.required" text="请再次输入密码" />
                        <u-error :visible="!$v.form.passwordConfirm.isTheSame" text="两次输入的密码不一致" />
                    </el-form-item>
                    <el-form-item>
                        <u-input v-model="form.realName" placeholder="请输入姓名" />
                        <u-error :visible="!$v.form.realName.required" text="请输入姓名" />
                    </el-form-item>
                    <el-form-item>
                        <u-input v-model="form.phone" :regex="/^[0-9\u4e00-\u9fa5]+$/g" maxLength="11" placeholder="请输入手机号" lazy />
                        <u-error :visible="!$v.form.phone.required" text="手机必填" />
                        <u-error :visible="!$v.form.phone.isPhone" text="手机格式不正确" />
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="form.birthday" type="date" placeholder="请输入你的生日" size="medium"> </el-date-picker>
                    </el-form-item>

                    <el-form-item class="operation">
                        <el-button type="primary" @click="onSubmit" round>注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </nav>
</template>

<script>
import { required, helpers } from 'vuelidate/lib/validators'

export default {
    props: {},
    data() {
        return {
            form: {
                account: '',
                password: '',
                passwordConfirm: '',
                realName: '',
                phone: '',
                birthday: ''
            },

            value: ''
        }
    },
    validations: {
        form: {
            account: {
                required,
                checkFormat: function(value) {
                    let regex_account = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,}$/g
                    return !helpers.req(value) || regex_account.test(value) // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                }
            },
            password: { required },
            passwordConfirm: {
                required,
                isTheSame(value) {
                    return !helpers.req(value) || value === this.form.password // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                }
            },
            realName: { required },
            phone: {
                required,
                isPhone(value) {
                    let regex_phone = /^1[345678][0-9]{9}$/
                    return !helpers.req(value) || regex_phone.test(value) // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                }
            }
        }
    },
    methods: {
        toggleBox() {
            this.$emit('toggle')
        },
        onSubmit() {
            console.log('submit!')
        },
        fogetPassword() {
            console.log(1)
        }
    }
}
</script>

<style lang="scss" scoped>
.u-sign-up {
    display: inline-block;
    position: relative;
    width: 400px;
    height: 520px;

    .sign-up-wrapper {
        height: 100%;

        /deep/ .el-card__body {
            padding: 40px;
            padding-top: 30px;

            .content {
                .el-input,
                .el-button {
                    width: 320px;
                }
                .el-form-item {
                    margin-bottom: 16px;
                }
            }

            .password-forget {
                position: absolute;
                right: 0;
            }

            .operation {
                position: absolute;
                bottom: 20px;
            }
        }
    }
}
</style>