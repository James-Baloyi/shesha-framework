﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Shesha.Domain.Attributes;
using Shesha.Domain.Enums;

namespace Shesha.Domain
{
    [Entity(TypeShortAlias = "Shesha.Framework.Note")]
    public class Note : FullPowerChildEntity
    {
        [ReferenceList("Shesha", "NoteType")]
        public virtual int? Category { get; set; }

        public virtual Note Parent { get; set; }

        [StringLength(int.MaxValue, MinimumLength = 3)]
        public virtual string NoteText { get; set; }

        public virtual Person Author { get; set; }
        public virtual bool HasAttachment { get; set; }

        public virtual RefListVisibilityType VisibilityType { get; set; }
    }
}
