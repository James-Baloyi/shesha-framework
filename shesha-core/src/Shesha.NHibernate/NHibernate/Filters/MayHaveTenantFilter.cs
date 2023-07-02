﻿using Abp.Domain.Entities;
using Abp.Domain.Uow;
using NHibernate;
using NHibernate.Engine;
using NHibernate.Type;
using Shesha.NHibernate.Utilites;
using System.Collections.Generic;

namespace Shesha.NHibernate.Filters
{
    /// <summary>
    /// Add filter MayHaveTenant 
    /// </summary>
    public class MayHaveTenantFilter
    {
        /// <summary>
        /// Returns filter definition
        /// </summary>
        public static FilterDefinition GetDefinition()
        {

            var filterDef = new FilterDefinition(
                AbpDataFilters.MayHaveTenant,
                $"({nameof(IMayHaveTenant.TenantId).EscapeDbObjectNameForNH()} = :{AbpDataFilters.Parameters.TenantId} or {nameof(IMayHaveTenant.TenantId).EscapeDbObjectNameForNH()} is null and :{AbpDataFilters.Parameters.TenantId} is null)",
                new Dictionary<string, IType>
                {
                    { AbpDataFilters.Parameters.TenantId, NHibernateUtil.Int32 }
                },
                false);
            return filterDef;
        }
    }
}