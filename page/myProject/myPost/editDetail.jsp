<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/fis" prefix="fis"%>

<fis:extends name="../../layout/frame.jsp">
	<fis:block name="body">
		<header>
			<fis:widget name="/page/widget/header/projectDetailHeader.jsp" />	
		</header>

		<div id="appEditDetail">
			<main>
				<div class="tic-article">
					<form id="formEditDetail">
						<div class="tic-article-header">
					        <div class="tic-article-header-left">
					            <img src="/static/images/avatar.png" alt="adoug">     
					        </div>
					        <div class="tic-article-header-center">
					            <p class="tic-title-strong"><c:out value='${user.username}' /></p>
					            <p class="tic-title-secondary"><c:out value='${project.date}' /></p>
					        </div>
					    </div>
						<p class="tic-error-tip" v-show="hasError">{{errorMsg}}</p>
						<div class="weui-cells weui-cells_form tic-cells-nomargin">
							<div class="weui-cell">
							    <div class="weui-cell__bd">
							        <textarea class="weui-textarea" name="promassage" placeholder="项目详情介绍（至少10个字）" rows="5"
									 v-model="promassage"></textarea>
							    </div>
							</div>
						</div>
						<hr>
						<div class="weui-cells__title tic-cells-title">招聘详情</div>
						<div class="weui-cells weui-cells_form">
						    <div class="weui-cell">
						        <div class="weui-cell__bd">
						            <textarea class="weui-textarea" name="prowant" placeholder="招聘信息（至少6个字）" rows="3"
									 v-model="prowant"></textarea>
						        </div>
							   </div>
						</div>
						<div class="weui-cells__title tic-cells-title">联系方式</div>
						<div class="weui-cells weui-cells_form">
						    <div class="weui-cell">
						        <div class="weui-cell__bd">
						            <textarea class="weui-textarea" name="concat" placeholder="请注明电话或邮箱或其他联系方式" rows="3"
									 v-model="concat"></textarea>
						        </div>
							   </div>
						</div>
						<c:set var="projectReject" value="false" />
						<c:if test="${project.statu == 'reject'}">
							<c:set var="projectReject" value="true" />
						</c:if>
						<input type="hidden" name="reject" value="<c:out value='${projectReject}' />">
						<input type="hidden" name="uid" value="<c:out value='${user.id}' />">
						<input type="hidden" name="proId" value="<c:out value='${project.proId}' />">
						<button class="weui-btn weui-btn_primary" id="btnConfirm" v-tap.prevent="{methods: validForm}">保存</button>
					</form>
				</div>
			</main>
			<div v-show="editIsFail" v-cloak>
			    <div class="weui-mask"></div>
			    <div class="weui-dialog">
			        <div class="weui-dialog__hd"><strong class="weui-dialog__title">提示</strong></div>
			        <div class="weui-dialog__bd">啊哦，修改失败，稍后重试呗~</div>
			        <div class="weui-dialog__ft">
			            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" v-tap.prevent="{methods: closeDialog}">确定</a>
			        </div>
			    </div>
			</div>
			<div id="toast" v-show="editIsSucc" v-cloak>
			    <div class="weui-mask_transparent"></div>
			    <div class="weui-toast">
			        <i class="weui-icon-success-no-circle weui-icon_toast"></i>
			        <p class="weui-toast__content">修改成功</p>
			    </div>
			</div>
		</div>
	</fis:block>

	<fis:block name="style">
		<fis:parent />
		<fis:require id="/static/scss/editDetailPost.scss" />
	</fis:block>

	<fis:block name="jsPre">
		<script type="text/javascript">
		    var projectInfo = {
		        "proId": '<c:out value="${project.proId}" />',
		        "proname": '<c:out value="${project.proname}" />',
				"title": '<c:out value="${project.concat}" />',
				"promassage": '<c:out value="${project.promassage}" />',
				"prowant": '<c:out value="${project.prowant}" />',
				"concat": '<c:out value="${project.concat}" />'
		    };
		    var userInfo = {
		        "id": '<c:out value="${user.id}" />'
		    };
		</script>
    </fis:block>

	<fis:block name="js">
		<fis:parent />
		<fis:require id="/static/js/myProject/myPost/editDetail.js" />
	</fis:block>
</fis:extends>