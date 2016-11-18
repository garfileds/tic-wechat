<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/fis" prefix="fis"%>

<fis:extends name="../layout/frame.jsp">
    <fis:block name="body">
    	<c:if test="${not empty user}">
			<header>
				<div class="tic-avatar">
					<div class="avatar">
						<img src="/static/images/avatar.png" alt="西电腾讯俱乐部">
						<p><c:out value="${user.userName}" /></p>
					</div>
					<div class="bg">
						<img src="/static/images/avatar-bg.png" alt="">
					</div>
				</div>
			</header>
			<main>
				<div class="tic-four-grid">
					<c:set var="notice" value="" />
					<c:if test="${user.hasMsg}">
						<c:set var="notice" value="notice" />
					</c:if>
					<a href="/user/msg?userid=<c:out value="${user.userid}" />" v-tap class="grid <c:out value="${notice}" />">
						<img src="/static/images/sys-msg.png" alt="系统消息">
						<p>系统消息</p>
					</a>
					<a class="grid" href="/user/info?userid=<c:out value="${user.userid}" />" v-tap>
						<img src="/static/images/profile.png" alt="个人信息">
						<p>个人信息</p>
					</a>
					<a class="grid" href="/logout" v-tap>
						<img src="/static/images/switch-account.png" alt="切换账号">
						<p>切换账号</p>
					</a>
					<a class="grid" href="/user/resetPass" v-tap>
						<img src="/static/images/change-pass.png" alt="修改密码">
						<p>修改密码</p>
					</a>
				</div>
			</main>
			<nav>
				<div class="tic-nav">
					<div><img src="/static/images/hall.png" alt="项目大厅"></div>
					<div><img src="/static/images/my-project.png" alt="我的项目"></div>
					<div><img src="/static/images/center.png" alt="个人中心"></div>
				</div>
			</nav>
		</c:if>

    </fis:block>

    <fis:block name="style">
    	<fis:parent />
    	<fis:require id="/static/scss/center.scss" />
    </fis:block>
</fis:extends>
