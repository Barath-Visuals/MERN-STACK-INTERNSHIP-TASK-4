
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const migrateNotes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'NotesDB',
        })

        console.log('MongoDB connected.')

        const result = await mongoose.connection
            .collection('Notes')
            .updateMany(
                {
                    owner: { $exists: false },
                    user: { $exists: true },
                },
                [
                    {
                        $set: {
                            owner: '$user',
                            tags: { $ifNull: ['$tags', []] },
                        },
                    },
                    {
                        $unset: 'user',
                    },
                ]
            )

        console.log('Migration completed.')
        console.log('Modified notes:', result.modifiedCount)

    } catch (error) {
        console.error('Migration failed:', error.message)
    } finally {
        await mongoose.disconnect()
    }
}

migrateNotes()
