<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/fis" prefix="fis"%>
<!DOCTYPE html><fis:html lang="en">
    <fis:head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <title>腾讯俱乐部项目池</title>
        <!-- <link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" /> -->

        <fis:block name="style">
            <fis:require id="/static/scss/admin/semantic.css" />
            <fis:require id="/static/scss/common.scss" />
            <fis:require id="/static/scss/admin/common.scss" />
        </fis:block>

        <fis:block name="js">
            <fis:require id="/static/libs/common.js" />
            <fis:require id="/static/libs/vue.js" />
            <fis:require id="/static/libs/vue-tap.js" />
            <fis:require id="/static/libs/mod.js" />
            <fis:require id="/static/libs/admin/common.js" />
        </fis:block>
        
        <fis:block name="jsPre">
        </fis:block>
    </fis:head>

    <fis:body class="body">
        <fis:block name="app">
            <div id="app" class="pushable tic-app">
                <div class="ui vertical inverted sidebar menu left"
                 :class="{visible: sidePush, uncover: sidePush}">
                    <div class="item">
                        <a href="<c:url value='/admin' />">西电TIC项目池</a>
                    </div>
                    <div class="item">
                        <div class="header">
                            项目管理
                        </div>
                        <div class="menu">
                            <a href="<c:url value='/admin/project/check' />" class="item">待审核项目</a>
                            <a href="<c:url value='/admin/project/look' />" class="item">已通过项目</a>
                        </div>
                    </div>
                    <div class="item">
                        <div class="header">
                            用户管理
                        </div>
                        <div class="menu">
                            <a href="<c:url value='/admin/user/look' />" class="item">用户浏览</a>
                        </div>
                    </div>
                </div>
                <div class="tic-menu-top ui fixed inverted menu">
                    <div class="ui container">
                        <a class="launch icon item" v-tap.prevent='{methods: push}'>
                            <i class="content icon"></i>
                        </a>
                        <div class="item tic-logo">TIC</div>
                        <div class="right menu">
                            <form @submit.prevent="search">
                                <div class="item">
                                    <div class="ui icon input">
                                        <input type="text" :placeholder="placeholder" v-model="keyWords">
                                        <i class="search link icon"></i>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="pusher"
                 :class="{dimmed: sidePush}">
                    <fis:block name="article"></fis:block>
                </div>

                <fis:block name="footer">
                </fis:block>
            </div>
            <!--livereload-->
        </fis:block>
    </fis:body>

</fis:html>

