<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="/fis" prefix="fis"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<fis:require id="./nav.scss" />

<nav>
    <div class="tic-nav">
        <div><a href="/hall"></a><img src="/static/images/hall.png" alt="项目大厅"></div>
         <div><a href="/myProject?userid=<c:out value="${user.id}" />"><img src="/static/images/my-project.png" alt="我的项目"></a></div>
        <div><a href="/user?userid=<c:out value="${user.id}" />"><img src="/static/images/center.png" alt="个人中心"></a></div>
    </div>
</nav>

