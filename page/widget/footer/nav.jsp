<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="/fis" prefix="fis"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<fis:require id="./nav.scss" />

<nav>
    <div class="tic-nav">
        <div>
        	<a href="<c:url value='/hall' />" :class="{selected: pageSelected === 'hall'}" v-cloak>
            	<img src="/static/images/hall-selected.png" alt="项目大厅" v-if="pageSelected === 'hall'" v-cloak>

                <img src="/static/images/hall.png" alt="项目大厅" v-else v-cloak>
                <p>项目大厅</p>
        	</a>
        </div>
        <div>
        	<a href="<c:url value='/myProject' />?type=join&userid=<c:out value="${user.id}" />"
             :class="{selected: pageSelected === 'myProject'}" v-cloak>
                <img src="/static/images/my-project-selected.png" alt="我的项目" v-if="pageSelected === 'myProject'" v-cloak>
                <img src="/static/images/my-project.png" alt="我的项目" v-else v-cloak>
                <p>我的项目</p>
        	</a>
        </div>
        <div>
        	<a href="<c:url value='/user' />?userid=<c:out value="${user.id}" />"
             :class="{selected: pageSelected === 'center'}" v-cloak>
                <img src="/static/images/center-selected.png" alt="个人中心" v-if="pageSelected === 'center'" v-cloak>
                <img src="/static/images/center.png" alt="个人中心" v-else v-cloak>
                <p>个人中心</p>
        	</a>
        </div>
    </div>
</nav>

