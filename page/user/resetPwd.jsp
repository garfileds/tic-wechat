<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/fis" prefix="fis"%>

<fis:extends name="../layout/frame.jsp">
  <fis:block name="body">
    <header>
      <div class="tic-header-three">
        <a :href="<c:url value='/user/login' />" v-tap class="tic-header-three-aside">
          <img src="/static/images/arrow_prev.png" alt="后退">
        </a>

        <h2>重置密码</h2>

        <span></span>
      </div>
    </header>

    <main>
      <c:choose>
        <c:when test='${findPwdValid}'>
          <img src="/static/images/change-pass-big.png" alt="西电腾讯俱乐部" />

          <form action="<c:url value='/fn/user/resetPwd' />" method="POST" class="tic-form" id="formResetPwd">
            <p class="tic-error-tip" v-show="hasError">{{errorMsg}}</p>

              <div class="tic-field">
                <input type="text" name="username" value="<c:out value='${user.username}' />" placeholder="用户名" disabled/>
              </div>

              <div class="tic-field"
                :class="{ 'tic-error': passError }">
                 <input type="password" name="passNew" placeholder="新密码"
                  v-model="passNew"/>
              </div>

              <div class="tic-field"
               :class="{ 'tic-error': passError }">
                <input type="password" name="passNewConfirm" placeholder="确认新密码"
                 v-model="passNewConfirm"/>
              </div>

              <input type="hidden" name="userId" value="<c:out value='${user.id}' />">

              <div class="tic-field">
                <button class="weui-btn weui-btn_primary" id="btnRestPass" v-tap.prevent="{ methods: validForm }">确认</button>
              </div>
            </form>
          </c:when>

        <c:otherwise>
          <p>链接失效，请重新找回密码~</p>
        </c:otherwise>
      </c:choose>
    </main>
  </fis:block>

  <fis:block name="style">
    <fis:parent />
    <fis:require id="/static/scss/register.scss" />
  </fis:block>

  <fis:block name="js">
    <fis:parent />

    <fis:require id="/static/js/user/resetPwd.js" />
  </fis:block>
</fis:extends>