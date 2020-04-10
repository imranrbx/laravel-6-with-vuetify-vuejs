<?php

Route::group(['middleware'=> ['auth:api'], 'namespace'=>'Api'], function () {
    Route::resource('roles', 'RoleController');
    Route::resource('users', 'UserController');
    Route::get('verify', 'UserController@verify');
    Route::post('email/verify', 'UserController@verifyEmail');
    Route::post('users/delete', 'UserController@deleteAll');
    Route::post('roles/delete', 'RoleController@deleteAll');
    Route::post('user/role', 'UserController@changeRole');
    Route::post('user/photo', 'UserController@changePhoto');
});
Route::post('login', 'Api\UserController@login')->name('login');
