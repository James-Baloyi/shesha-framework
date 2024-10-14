﻿using Abp.Authorization;
using Shesha.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shesha.Authorization
{
    public interface IObjectPermissionChecker
    {
        Task AuthorizeAsync(bool requireAll, string permissionedObject, string method, string objectType, bool IsAuthenticated, RefListPermissionedAccess? replaceInherited = null);
    }
}
