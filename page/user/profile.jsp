<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/fis" prefix="fis"%>

<fis:extends name="../layout/frame.jsp">
	<fis:block name="body">
		<header>
			<div class="tic-header-three">
				<div class="tic-return">
					<span>&lt;</span>
				</div>
				<h2>个人信息</h2>
				<div>
					<img src="/static/images/change-profile.png" alt="修改个人信息">
				</div>
			</div>
		</header>
		<main>
			<div>
				<h3>个人信息修改</h3>
				<p>(完善个人信息后，系统可帮您在加入项目时预填哦~)</p>
			</div>
			<div>
				<table>
					<thead>
						<th></th>
						<th></th>
					</thead>
					<tbody>
						<tr>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
		</main>
	</fis:block>

	<fis:block name="style">
		<fis:parent />
	</fis:block>

	<fis:block name="js">
		<fis:parent />
		<fis:require id="/static/libs/mod.js" />
		<fis:require id="/static/js/user/register.js" />
	</fis:block>
</fis:extends>