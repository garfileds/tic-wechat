<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/fis" prefix="fis"%>

<fis:extends name="../layout/frame.jsp">
    <fis:block name="body">
        <header>
            <div class="tic-header-three">
                <a href="javascript:window.history.go(-1);" v-tap class="tic-header-three-aside">
                    <img src="/static/images/arrow_prev.png" alt="后退">
                </a>
                <h2>找回密码</h2>
                <span></span>
            </div>
        </header>

        <main>
            <p class="findPwd-tip">我们会向你输入的邮箱发送验证链接，请注意查收</p>

            <form action="<c:url value='/fn/user/resetPass' />" method="POST" class="tic-form" id="formFindPwd">
                <p class="tic-error-tip"
                 v-show="hasError">{{errorMsg}}</p>

                <div class="tic-field"
                 :class="{ 'tic-error': emailError }">
                    <input type="text" name="email" placeholder="请输入邮箱" v-model="email" />
                </div>

                <div class="tic-field">
                    <button class="weui-btn weui-btn_primary" id="btnFindPwd" v-tap.prevent="{ methods: validForm }">确定</button>
                </div>

                <div id="toast" v-show="findPwdIsOk" v-cloak>
                    <div class="weui-mask_transparent"></div>
                    <div class="weui-toast">
                        <i class="weui-icon-success-no-circle weui-icon_toast"></i>
                        <p class="weui-toast__content">验证邮件已发出</p>
                    </div>
                </div>
            </form>
        </main>
    </fis:block>

    <fis:block name="style">
        <fis:parent />
        <fis:require id="/static/scss/register.scss" />
        <fis:require id="/static/scss/findPwd.scss" />
    </fis:block>

    <fis:block name="js">
        <fis:parent />
        <fis:require id="/static/js/user/findPwd.js" />
    </fis:block>

    <fis:block name="jsPre">
    </fis:block>
</fis:extends>