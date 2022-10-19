import { Application } from "egg";

export default function (app: Application) {

    const { INTEGER, TEXT, STRING } = app.Sequelize
    const Model = app.model.define('record_check', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        code: { type: INTEGER, allowNull: true },
        msg: { type: TEXT, allowNull: true },
        type: { type: STRING, allowNull: true },
        url: { type: TEXT, allowNull: true }
    }, {
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        underscored: true,
        hooks: {
            afterCreate: async () => {

                const res = await Model.findOne({
                    attributes: [[(Model as any).sequelize.fn('COUNT', (Model as any).sequelize.col('*')), 'num']]
                })

                if ((res as any).dataValues.num >= 250) {
                    (Model as any).sequelize.query("DELETE FROM `record_check` ORDER BY `created_at` LIMIT 20;")
                }

            }
        }
    })

    return class RecordCheck extends Model {
        static associate() {
        }
    };

}