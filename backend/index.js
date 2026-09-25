const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Example: GET http://localhost:3000/api/type/fire
app.get('/api/type/:type', async (req, res) => {
  const type = encodeURIComponent(req.params.type)

  try {
    const pokeApiResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}/`)
    const data = await pokeApiResponse.json()

    if (!pokeApiResponse.ok) {
      return res.status(pokeApiResponse.status).json(data)
    }

    const damageRelations = data.damage_relations
    res.json({
      half_damage_to: damageRelations.half_damage_to.map(({ name }) => name),
      double_damage_from: damageRelations.double_damage_from.map(({ name }) => name),
    })
  } catch (error) {
    console.error('Failed to fetch Pokémon type:', error)
    res.status(502).json({ message: 'Could not reach PokéAPI.' })
  }
})

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`)
})
