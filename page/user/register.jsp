<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/fis" prefix="fis"%>

<fis:extends name="../layout/frame.jsp">
	<fis:block name="body">
		<header>
			<h2>注册</h2>
		</header>
		<main>
			<img src="/static/images/logo2.png" alt="西电腾讯俱乐部" />

			<form action="<c:url value='/fn/user/register' />" method="POST" class="tic-form" id="formRegister">
				<p class="tic-error-tip" 
				     v-show="hasError" v-cloak>{{errorMsg}}</p>
				<div class="tic-field"
					 :class="{ 'tic-error': usernameError }">
					<input type="text" name="username" placeholder="用户名" 
						 v-model="username"
						 @blur="validUsername"/>
				</div>
				<div class="tic-field"
					 :class="{ 'tic-error': passError }">
					<input type="password" name="pass" placeholder="密码" 
						 v-model="password"
						 @blur="validPass"/>
				</div>
				<div class="tic-field"
					 :class="{ 'tic-error': passError }">
					<input type="password" name="passConfirm" placeholder="确认密码" 
						 v-model="passConfirm"/>
				</div>
				<div class="tic-field">
					<button class="weui-btn weui-btn_primary" id="btnRegister" v-tap.prevent="{ methods: validForm }">注册</button>
				</div>
				<a href="<c:url value='/user/login' />" class="tic-form-para">
					已有账号？返回登录
				</a>
			</form>
		</main>
	</fis:block>

	<fis:block name="style">
		<fis:parent />
		<fis:require id="/static/scss/register.scss" />
	</fis:block>

	<fis:block name="js">
		<fis:parent />
		
		<fis:require id="/static/js/user/register.js" />
	</fis:block>
</fis:extends>