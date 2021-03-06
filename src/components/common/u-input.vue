<template>
    <div :class="['u-input', { textarea: isTextArea }]" v-bind="$attrs">
        <template v-if="!isTextArea">
            <input
                v-if="!lazy"
                v-model="inputValue"
                v-bind="$attrs"
                v-on="listeners"
                @input="onInput($event.target.value)"
                @blur="onBlur"
                @keypress.enter="keyPressEnter"
                :disabled="disabled"
                :type="type"
                class="input"
            />
            <input
                v-else
                v-model.lazy="inputValue"
                v-bind="$attrs"
                v-on="listeners"
                @change="onInput($event.target.value)"
                @blur="onBlur"
                @keypress.enter="keyPressEnter"
                :disabled="disabled"
                :type="type"
                class="input"
            />
            <i v-if="searchIcon" class="icon el-icon-search"></i>
        </template>
        <textarea
            v-else
            v-model="inputValue"
            v-bind="$attrs"
            v-on="listeners"
            @input="onInput($event.target.value)"
            @blur="onBlur"
            :disabled="disabled"
            class="input textarea"
        />
    </div>
</template>

<script>
export default {
    name: 'u-input',
    props: {
        type: { type: String, default: 'text' },
        value: { type: [String, Number] },
        disabled: { type: Boolean, default: false },
        lazy: { type: Boolean, default: false },
        regex: { type: RegExp, default: null },
        searchIcon: { type: Boolean, default: false }
    },
    data() {
        return {
            inputValue: this.value,
            oldValue: this.value
        }
    },
    computed: {
        isTextArea() {
            return ['text', 'search', 'number', 'password'].indexOf(this.type) === -1
        },
        listeners() {
            const listeners = Object.assign({}, this.$listeners)
            delete listeners['input']
            delete listeners['blur']
            return listeners
        }
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    watch: {
        value(val) {
            this.onInput(val)
        }
    },
    methods: {
        keyPressEnter() {
            this.$emit('key-press-enter')
        },
        onInput(currentInputValue) {
            let newValue = this._isRegexValid(currentInputValue) ? currentInputValue : this.oldValue
            this.inputValue = this.oldValue = newValue

            this.$emit('input', this.inputValue)
        },
        onBlur(ev) {
            this.$emit('blur', this.inputValue, ev)
        },
        _isRegexValid(val) {
            if (!this.regex) return true
            if (!val.toString()) return true /* fix: 为空也不用判断 */
            return val.toString().match(this.regex)
        }
    }
}
</script>

<style lang="scss" scoped>
.u-input {
    display: inline-block;
    position: relative;
    height: $component-height;
    width: 320px;
    height: 40px;

    &.textarea {
        height: 180px;
    }

    &[size='xs'] {
        width: 100px;
    }

    &[size='s'] {
        width: 120px;
    }

    &[size='l'] {
        width: 400px;
    }

    &[size='xxl'] {
        width: 664px;
        height: 40px;
    }

    .input {
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: $normal-color-m;
        padding: 0 15px;
        border: 1px solid $border-color;
        border-radius: 4px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

        &[disabled] {
            color: #c0c4cc;
            border-color: #e4e7ed;
            background: $brand-disabled;
            cursor: not-allowed;
        }

        &:focus {
            border: 1px solid $primary-color;
        }

        &:-ms-input-placeholder {
            @extend .placeholder-text;
        }

        &:-moz-placeholder {
            @extend .placeholder-text;
        }

        &::-moz-placeholder {
            @extend .placeholder-text;
        }

        &::-webkit-input-placeholder {
            // 为何不能用@extend?
            @include font-normal(14px, $tip-color-s);
            letter-spacing: 0;
            line-height: 14px;
        }

        .placeholder-text {
            @include font-normal(14px, $tip-color-s);
            letter-spacing: 0;
            line-height: 14px;
        }
    }

    .textarea {
        padding: 15px;
    }

    .icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
        font-size: 18px;
        color: $normal-color-s;
    }
}
</style>
