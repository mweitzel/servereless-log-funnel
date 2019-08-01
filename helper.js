module.exports = {
  dig(obj, path) {
    const chunks = path.split('.')
    return chunks.reduce((current, chunk) => {
      if(current){
        return current[chunk]
      }
    }, obj)
  }
}
