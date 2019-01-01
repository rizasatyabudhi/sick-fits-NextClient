import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!,
    $title: String,
    $description: String,
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title,
      description: $description,
      price: $price
    ) {
      id,
      title,
      description,
      price
    }
  }
`

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id:$id }) {
      id
      title
      price
      description
    }
  }
`

export default class UpdateItem extends Component {
  state = {}

  handleChange = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  handleSubmit = async (e, updateItemMutation) => {
    e.preventDefault()
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    })
    Router.push('/')
  }

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{id:this.props.id}}>
        { ({data, loading}) => {
          if (loading) return <p>Loading....</p>
          if (!data.item) return <p>No item found for ID: {this.props.id}</p>
          return (
          <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
          {(updateItem, { loading, error}) => (
            <Form onSubmit={e => this.handleSubmit(e, updateItem)}>
            <Error error={error} />
              <fieldset disabled={loading} aria-budy={loading}>
                <label htmlFor="title">
                  Title
                  <input
                    name="title"
                    id="title"
                    placeholder="Title"
                    type="text"
                    required
                    onChange={this.handleChange}
                    defaultValue={data.item.title}
                    />
                </label>
                <label htmlFor="price">
                  Price
                  <input
                    name="price"
                    id="price"
                    placeholder="Price"
                    type="number"
                    required
                    onChange={this.handleChange}
                    defaultValue={data.item.price}
                    />
                </label>
                <label htmlFor="description">
                  Description
                  <textarea
                    name="description"
                    id="description"
                    placeholder="Enter A Description"
                    required
                    onChange={this.handleChange}
                    defaultValue={data.item.description}
                    />
                </label>
                <button type="submit">Save Changes</button>
              </fieldset>
            </Form>
            )}
          </Mutation>
          )
        }}
      </Query>
    )
  }
}

export { UPDATE_ITEM_MUTATION }