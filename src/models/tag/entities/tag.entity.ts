import { BaseEntity } from "src/models/shared/base.entity"
import { Column, Entity } from "typeorm"

@Entity({name: 'tag'})
export class Tag extends BaseEntity {s
  @Column({ unique: true })
  name: string
}
