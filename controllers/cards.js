const Card = require('../models/card');
const {
  ERROR_NOT_FOUND,
  ERROR_BAD_REQUEST,
  ERROR_DEFAULT,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERROR_DEFAULT).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не c указанным id не найдена' });
        return;
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Error('Нельзя удалять чужие карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};
