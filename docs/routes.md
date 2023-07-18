## Routes

**Auth routes**
Title|Route|Method|Token Required|Roles
|:--:|:--:|:--:|:--:|:--:|
signin|`/auth/signin`|post|&#9744;|all
signup|`/auth/signup`|post|&#9745;|admin
forget password|`/auth/forget-password`|get|&#9744;|all
reset forgeted password|`/auth/reset-password`|put|&#9744;|all
---
**User routes**
- All routes require JWT token.

Title|Route|Method|Roles
|:--:|:--:|:--:|:--:|
find all|`/users`|get|all
find one|`/users/:id`|get|all
update|`/users/:id`|patch|admin
update self|`/users/me`|put|all
delete|`/users/:id`|delete|admin
change password|`/users/me/password`|put|all
count users|`/users/count-roles`|get|admin
---
**Team routes**
- All routes require JWT token

Title|Route|Method|Roles
|:--:|:--:|:--:|:--:|
create|`/teams`|post|admin
find all|`/teams`|get|all
find one|`/teams`|get|all
update|`/teams/:id`|patch|admin
delete|`/teams/:id`|delete|admin
count|`/teams/count-teams`|get|admin
---
**Task gateways**
- All gateways require JWT token

Title|event|emit|emit to|Roles
|:--:|:--:|:--:|:--:|:--:|
create|`createTask`|`createNewTask`|all|admin,coach
find all|`findAllTasks`|`response`|client|all
find one|`findOneTask`|`response`|client|all
update|`updateTask`|`updateTaskDto`|all|admin,coach
delete|`removeTask`|`deleteExistsTask`|all|admin,coach
count|`countTasks`|`response`|client|admin
---
**Assignment gateways**
- All gateways require JWT token

Title|event|emit|emit to|Roles
|:--:|:--:|:--:|:--:|:--:|
create|`createAssignment`|`createNewAssignment`|all|trainee
find all|`findAllAssignments`|`response`|client|all
find one|`findOneAssignment`|`response`|client|all
update|`updateAssignment`|`updateExistsAssignment`|all|trainee
update status|`updateAssignmentStatus`|`updateExistsAssignment`|all|trainee,coach
delete|`removeAssignment`|`deleteExistsAssignment`|all|trainee
how many users assign tasks|`assignmentCount`|`response`|client|admin
how many users assign one task|`assignmentCountByTask`|`response`|client|admin
---
**Review gateways**
- All gateways require JWT token

Title|event|emit|emit to|Roles
|:--:|:--:|:--:|:--:|:--:|
create|`createReview`|`createdNewReview`|all|trainee
find one|`findOneReview`|`response`|client|all
update|`updateReview`|`updateExistedReview`|all|trainee
delete|`removeReview`|`removeExistedReview`|all|trainee
---
**Feedback gateways**
- All gateways require JWT token

Title|event|emit|emit to|Roles
|:--:|:--:|:--:|:--:|:--:|
create|`createFeedback`|`createNewFeedback`|coaches, admins|coach, admin
find all|`findAllFeedback`|`response`|client|coach, admin
find one|`findOneFeedback`|`response`|client|all
update|`updateFeedback`|`updateExistsFeedback`|coaches,admins|coach, admin
delete|`removeFeedback`|`removeExistsFeedback`|coaches,admins|admin
