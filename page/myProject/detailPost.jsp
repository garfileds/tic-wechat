<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/fis" prefix="fis"%>

<fis:extends name="../layout/frame.jsp">
    <fis:block name="body">
		<header>
			<fis:widget name="/page/widget/header/projectDetailHeader.jsp" />	
		</header>

		<main>
			<fis:widget name="/page/widget/main/projectDetail.jsp" />	
		</main>

		<footer class="tic-detail-footer">
			<a href="<c:url value='/myPost/editDetail' />?proId=<c:out value='${project.proId}' />" v-tap>
				<img src="/static/images/myProject/edit-info.png" alt="编辑信息">
			</a>
			<a href="<c:url value='/myPost/signInfo' />?proId=<c:out value='${project.proId}' />" v-tap>
				<img src="/static/images/myProject/sign-info.png" alt="报名信息">
			</a>
		</footer>
	</fis:block>

	<fis:block name="style">
		<fis:parent />
		<fis:require id="/static/scss/detailPost.scss" />
	</fis:block>

	<fis:block name="jsPre">
		<script type="text/javascript">
		    var projectInfo = {
		        "proId": '<c:out value="${project.proId}" />',
		        "proname": '<c:out value="${project.proname}" />',
		        "isCollected": <c:out value="${project.isCollected}" />
		    };
		    var userInfo = {
		        "id": '<c:out value="${user.id}" />'
		    };
		</script>
	</fis:block>

	<fis:block name="js">
		<fis:parent />
		<fis:require id="/static/libs/mod.js" />
    </fis:block>

</fis:extends>