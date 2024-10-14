﻿using Abp.Domain.Entities;
using System;

namespace Shesha.Services
{
    /// <summary>
    /// Entity type provider
    /// </summary>
    public interface IEntityTypeProvider
    {
        /// <summary>
        /// Get real type of entity
        /// </summary>
        Type GetEntityType<TId>(IEntity<TId> entity);
    }
}
