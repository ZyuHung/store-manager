<template>
    <nav class="u-sign-in">
        <el-card class="sign-in-wrapper">
            <div slot="header" class="clearfix">
                <span>登录</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toggleBox">去注册</el-button>
            </div>
            <div class="content">
                <el-form ref="form" :model="form">
                    <template v-if="form.loginType === LOGIN_TYPE.BY_PHONE">
                        <el-form-item>
                            <u-input
                                v-model="form.phone"
                                :regex="/^[0-9\u4e00-\u9fa5]+$/g"
                                @keypress.enter="onSubmit"
                                maxLength="11"
                                placeholder="请输入手机号"
                            />
                            <u-error :visible="!$v.form.phone.required" text="手机必填" />
                            <u-error :visible="!$v.form.phone.isPhone" text="手机格式不正确" />
                        </el-form-item>
                        <el-form-item>
                            <ASmsCodeInput
                                v-model="form.smsCode"
                                :phone="form.phone"
                                :isCorrectPhone="!$v.form.phone.required || !$v.form.phone.isPhone"
                                :isLogin="true"
                                @onEnterPress="onSubmit"
                            />
                        </el-form-item>
                    </template>

                    <template v-else>
                        <el-form-item>
                            <u-input
                                v-model.trim="form.account"
                                :regex="/^[a-zA-Z0-9\u4e00-\u9fa5]+$/g"
                                @keypress.enter="onSubmit"
                                maxLength="100"
                                placeholder="请输入账号"
                            />
                            <u-error :visible="!$v.form.account.required" text="账号不能为空" />
                        </el-form-item>
                        <el-form-item>
                            <u-input v-model.trim="form.password" @keypress.enter="onSubmit" maxLength="100" placeholder="请输入密码" type="password" />
                            <u-error :visible="!$v.form.password.required" text="密码不能为空" />
                        </el-form-item>
                    </template>
                    <!-- <el-form-item>
                        <el-checkbox v-model="passwordMemory">记住密码</el-checkbox>
                        <u-link-text class="password-forget" text="忘记密码" @click="fogetPassword" />
                    </el-form-item> -->

                    <el-form-item class="operation">
                        <el-button type="primary" @click="onSubmit" :disabled="$v.$invalid" round class="sign-in-btn">登录</el-button>
                    </el-form-item>

                    <el-form-item class="login-type-wrapper">
                        <u-link-text class="login-type-btn" :text="!!form.loginType ? '账号密码登录' : '手机号登录'" @click="toggleLoginType" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </nav>
</template>

<script>
import ASmsCodeInput from '@/components/account/a-smsCode-input'
import { requiredIf, helpers } from 'vuelidate/lib/validators'
import { signIn } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'

const { mapActions } = createNamespacedHelpers('login')
const LOGIN_TYPE = {
    BY_ACCOUNT: 0,
    BY_PHONE: 1
}

export default {
    components: { ASmsCodeInput },
    props: {},
    data() {
        return {
            form: {
                account: '',
                password: '',
                phone: '',
                smsCode: '',
                loginType: LOGIN_TYPE.BY_PHONE
            },

            passwordMemory: false,
            value: '',

            LOGIN_TYPE
        }
    },
    validations: {
        form: {
            account: {
                required: requiredIf(function() {
                    return this.form.loginType === LOGIN_TYPE.BY_ACCOUNT
                })
            },
            password: {
                required: requiredIf(function() {
                    return this.form.loginType === LOGIN_TYPE.BY_ACCOUNT
                })
            },
            phone: {
                required: requiredIf(function() {
                    return this.form.loginType === LOGIN_TYPE.BY_PHONE
                }),
                isPhone(value) {
                    let regex_phone = /^1[345678][0-9]{9}$/
                    return !helpers.req(value) || regex_phone.test(value) // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                }
            },
            smsCode: {
                required: requiredIf(function() {
                    return this.form.loginType === LOGIN_TYPE.BY_PHONE
                })
            }
        }
    },
    methods: {
        toggleLoginType() {
            if (this.form.loginType === LOGIN_TYPE.BY_ACCOUNT) {
                this.form.loginType = LOGIN_TYPE.BY_PHONE
                this.form.account = ''
                this.form.password = ''
            } else {
                this.form.loginType = LOGIN_TYPE.BY_ACCOUNT
                this.form.phone = ''
                this.form.smsCode = ''
            }
        },
        toggleBox() {
            this.$emit('toggle')
        },
        onSubmit() {
            signIn(this.form).then(() => {
                this.$message('登录成功')
                this.actSetIfLogin(true)
                this.$router.push({ name: 'manager' })
            })
        },
        fogetPassword() {
            this.$message('忘记密码请联系店员')
        },
        ...mapActions(['actSetIfLogin', 'actSetUserInfoStore'])
    }
}
</script>

<style lang="scss" scoped>
.u-sign-in {
    display: inline-block;
    position: relative;
    width: 400px;
    height: 520px;

    .sign-in-wrapper {
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
                bottom: 40px;
            }

            .login-type-wrapper {
                position: absolute;
                right: 40px;
                bottom: 0;
            }
        }
    }
}
</style>
