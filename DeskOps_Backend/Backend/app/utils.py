from .models import Users

def check_group(group_name,user_id) -> bool:
    try:
        #select * from CustomUser where id = x
        user = Users.objects.get(id=user_id)
        return user.groups.filter(name=group_name).exists()
    except Users.DoesNotExist:
        return False

def isAdmin(user_id) -> bool:
    return check_group('ADMIN',user_id)